import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { AccountLoginCommand, AndroidIgpapi } from '@igpapi/android';
import { NotFoundError, Observable, Subject } from 'rxjs';
import { Bot, Request } from './utils/ig-queque/types';
import { requestProcessFactory } from './utils/ig-queque/request/requestProcessFactory';
import { createRequestFactory } from './utils/ig-queque/request/createRequestFactory';
import { botSpawnFactory } from './utils/ig-queque/bot/botSpawnFactory';
import { botCounterFactory } from './utils/ig-queque/bot/botCounterFactory';
import { BotService } from './bot.service';
import { CreateBotDto, UpdateBotDto } from './utils/ig-queque/dto/createBotDto';
import {
  processRequestHighlighted,
  processRequestHighlightedList,
  processRequestStory,
} from './utils/ig-requests/igRequestProcess';
import { LogService } from './log.service';
import { IgQuequeError } from './utils/ig-queque/request/error';
import { searchUser } from './utils/ig-requests/getStory';
import { restoreState } from './utils/ig-requests/restoreState';

@Injectable()
export class AppService {
  request$: Subject<Request>;
  // Bots
  freeBot$: Subject<Bot>;
  botIsBusy$: Subject<Bot>;
  botCounter$: Observable<number>;
  botNest$: Observable<Bot>;
  constructor(private botService: BotService, private logService: LogService) {
    // this.prisma = prisma;

    this.request$ = new Subject<Request>();
    this.freeBot$ = new Subject<Bot>();
    this.botIsBusy$ = new Subject<Bot>();
    this.botCounter$ = botCounterFactory(this.freeBot$, this.botIsBusy$);
    this.botNest$ = botSpawnFactory(this.botCounter$, this.getBots.bind(this));

    requestProcessFactory(
      this.request$,
      this.freeBot$,
      this.botIsBusy$,
      this.botCounter$,
      this.botNest$,
      // processRequest,
    ).subscribe({
      next: (result: IgQuequeError | { request: Request; bot: Bot }) => {
        if (result instanceof IgQuequeError) {
          const { e, request, bot } = result;
          console.error('Req err', e);
          this.disableBot(bot, e);
          this.logService.logRequestErr(bot, request, e);
          console.error('eee===', e);
        } else {
          const { bot, request } = result;
          this.logService.logRequest(bot, request);
        }
      },
      error: (e: Error) => {
        console.error('Uncached error', e);
      },
    });
  }

  async getUserStory(targetUser: string, skip: number) {
    return createRequestFactory(
      this.request$,
      targetUser,
      { skip },
      processRequestStory,
    );
  }

  async getHighligted(highlightId: string) {
    return createRequestFactory(
      this.request$,
      highlightId,
      {},
      processRequestHighlighted,
    );
  }

  async getHighligtedList(targetUser: string) {
    return createRequestFactory(
      this.request$,
      targetUser,
      {},
      processRequestHighlightedList,
    );
  }

  getBots() {
    return this.botService.getBots({
      where: {
        hasError: false,
      },
    });
  }

  async getBot(auth: { username: string; password: string; proxy: string }) {
    const ig = new AndroidIgpapi();
    ig.state.device.generate(auth.username);

    ig.state.proxyUrl = auth.proxy;

    await ig.execute(AccountLoginCommand, {
      username: auth.username,
      password: auth.password,
    });

    return ig;
  }

  async createBot(createBot: CreateBotDto) {
    const ig = new AndroidIgpapi();
    ig.state.device.generate(createBot.username);
    ig.state.proxyUrl = createBot.proxy;
    await ig.execute(AccountLoginCommand, {
      username: createBot.username,
      password: createBot.password,
    });
    const session = JSON.stringify(ig.state);

    const bot = await this.botService.createUser({
      ...createBot,
      session,
      hasError: false,
    });

    this.freeBot$.next({
      id: String(bot.id),
      session: bot.session,
    });
    return bot;
  }

  async updateBot(botUsername: string, updateBot: UpdateBotDto) {
    debugger;
    const botInstance = await this.botService.getBot({ username: botUsername });

    if (!botInstance) {
      throw new Error('not found');
    }

    const password = updateBot.newPassword || botInstance.password;
    const proxy = updateBot.newProxy || botInstance.proxy;

    let session = botInstance.session;

    let ig: AndroidIgpapi;

    if (updateBot.resetSession) {
      ig = new AndroidIgpapi();
      ig.state.device.generate(botInstance.username);
      ig.state.proxyUrl = proxy;
      await ig.execute(AccountLoginCommand, {
        username: botInstance.username,
        password: password,
      });
      session = JSON.stringify(ig.state);
    } else {
      ig = restoreState(botInstance.session);
      ig.state.proxyUrl = proxy;
    }

    await searchUser(ig, 'instagram', {});

    const bot = await this.botService.updateBot({
      where: {
        id: botInstance.id,
      },
      data: {
        session,
        password,
        proxy,
        hasError: false,
        error: null,
      },
    });

    setTimeout(() => {
      this.freeBot$.next({
        id: String(botInstance.id),
        session: bot.session,
      });
    }, 1000);
    return bot;
  }

  async disableBot(bot: Bot, e: Error) {
    return this.botService.updateBot({
      where: {
        id: Number(bot.id),
      },
      data: {
        hasError: true,
        error: `${e}  `,
      },
    });
  }

  async getBotStatus() {
    const active = await (
      await this.botService.getBots({ where: { hasError: true } })
    ).map((bot) => ({
      ...bot,
      session: undefined,
    }));
    const disabled = (
      await this.botService.getBots({
        where: {
          hasError: false,
        },
      })
    ).map((bot) => ({
      ...bot,
      session: undefined,
    }));

    return { active, disabled };
  }
}

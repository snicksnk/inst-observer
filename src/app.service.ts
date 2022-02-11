import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { AccountLoginCommand, AndroidIgpapi } from '@igpapi/android';
import { Observable, Subject } from 'rxjs';
import { Bot, Request } from './utils/ig-queque/types';
import { requestProcessFactory } from './utils/ig-queque/request/requestProcessFactory';
import { createRequestFactory } from './utils/ig-queque/request/createRequestFactory';
import { botSpawnFactory } from './utils/ig-queque/bot/botSpawnFactory';
import { botCounterFactory } from './utils/ig-queque/bot/botCounterFactory';
import { BotService } from './bot.service';
import { CreateBotDto } from './utils/ig-queque/dto/createBotDto';
import {
  processRequestHighlighted,
  processRequestStory,
} from './utils/ig-requests/igRequestProcess';
import { LogService } from './log.service';

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
      next: ({ request, bot }) => this.logService.logRequest(bot, request),
      error: ({ e, request, bot }) => {
        console.error('Req err', e);
        this.logService.logRequestErr(bot, request, e);
      },
    });
  }

  async getUserStory(targetUser: string) {
    return createRequestFactory(this.request$, targetUser, processRequestStory);
  }

  async getHighligted(targetUser: string) {
    return createRequestFactory(
      this.request$,
      targetUser,
      processRequestHighlighted,
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
    let session = createBot.session;
    if (!session) {
      const ig = new AndroidIgpapi();
      ig.state.device.generate(createBot.username);
      ig.state.proxyUrl = createBot.proxy;
      await ig.execute(AccountLoginCommand, {
        username: createBot.username,
        password: createBot.password,
      });
      session = JSON.stringify(ig.state);
    }

    const bot = await this.botService.createUser({ ...createBot, session });
    return bot;
  }
}

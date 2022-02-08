import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { AccountLoginCommand, AndroidIgpapi } from '@igpapi/android';
import { Observable, Subject } from 'rxjs';
import { Bot, Request } from './utils/ig-queque/types';
import { requestProcessFactory } from './utils/ig-queque/request/requestProcessFactory';
import { createRequestFactory } from './utils/ig-queque/request/createRequestFactory';
import { restoreState } from './utils/ig-requests/restoreState';
import { getUserStory } from './utils/ig-requests/getStory';
import { botSpawnFactory } from './utils/ig-queque/bot/botSpawnFactory';
import { botCounterFactory } from './utils/ig-queque/bot/botCounterFactory';

@Injectable()
export class AppService {
  request$: Subject<Request>;
  // Bots
  freeBot$: Subject<Bot>;
  botIsBusy$: Subject<Bot>;
  botCounter$: Observable<number>;
  botNest$: Observable<Bot>;
  // Request
  requestProcess$: Observable<{
    request: Request;
    bot: Bot;
  }>;

  // const ig =  restoreState(JSON.stringify(session));
  // return await getUserStory(ig, targetUser);

  constructor() {
    const processRequest = (request: Request, bot: Bot) =>
      new Promise((res) => {
        const ig = restoreState(bot.session);
        getUserStory(ig, request.targetUser).then(res);
      });

    this.request$ = new Subject<Request>();
    this.freeBot$ = new Subject<Bot>();
    this.botIsBusy$ = new Subject<Bot>();
    this.requestProcess$ = requestProcessFactory(
      this.request$,
      this.freeBot$,
      this.botIsBusy$,
      processRequest,
    );

    this.botCounter$ = botCounterFactory(this.freeBot$, this.botIsBusy$);
    this.botNest$ = botSpawnFactory(this.botCounter$);

    this.botNest$.subscribe((bot) => {
      this.freeBot$.next(bot);
    });
  }

  async getUserStory(targetUser: string) {
    return createRequestFactory(this.request$, targetUser);
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
}

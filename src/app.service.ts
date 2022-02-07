import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { AccountLoginCommand, AndroidIgpapi } from '@igpapi/android';
import { Observable, Subject } from 'rxjs';
import { Bot, Request } from './utils/ig-queque/types';
import { requestProcessFactory } from './utils/ig-queque/requestProcessFactory';
import { createRequestFactory } from './utils/ig-queque/createRequestFactory';

@Injectable()
export class AppService {
  request$: Subject<Request>;
  freeBot$: Subject<Bot>;
  botIsBusy$: Subject<Bot>;
  requestProcess$: Observable<{
    request: Request;
    bot: Bot;
  }>;

  constructor() {
    const processRequest = (request: Request, bot: Bot) =>
      new Promise((res) =>
        setTimeout(
          () => res(` ️ Process compleate ${request.targetUser}`),
          5000,
        ),
      );

    this.request$ = new Subject<Request>();
    this.freeBot$ = new Subject<Bot>();
    this.botIsBusy$ = new Subject<Bot>();
    this.requestProcess$ = requestProcessFactory(
      this.request$,
      this.freeBot$,
      this.botIsBusy$,
      processRequest,
    );

    this.freeBot$.next({
      id: 'Bot_1',
    });
  }

  async getUserStory(targetUser: string) {
    return createRequestFactory(this.request$, targetUser);
  }

  async getBot() {
    const ig = new AndroidIgpapi();
    ig.state.device.generate('userId');

    ig.state.proxyUrl = 'http://Lrp7e3qE:vHcHa6xx@194.226.184.45:64723';

    await ig.execute(AccountLoginCommand, {
      username: 'ip_storozhev_yz',
      password: 'ToPvuR9z8H',
    });

    return ig;
  }

  async getStory(ig: any, searchAccount: string) {
    const targetUser = await ig.user.searchExact(searchAccount); // getting exact user by login

    debugger;

    const reelsFeed = ig.feed.reelsMedia({
      userIds: [targetUser.pk],
    });
    const storyItems = await reelsFeed.items(); // getting reels, see "account-followers.feed.example.ts" if you want to know how to work with feeds
    if (storyItems.length === 0) {
      console.log(`${targetUser.username}'s story is empty`);
      return;
    }

    console.dir(storyItems[0]);

    return storyItems[0];
  }
}

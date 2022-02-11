import { UserStoryFeedResponseItemsItem } from '@igpapi/android';

import { Observable } from 'rxjs';
import { Request, Bot } from 'src/utils/ig-queque/types';
import { getHighlighted, getUserStory } from './getStory';
import { restoreState } from './restoreState';

export const processRequestStory = (
  request: Request<UserStoryFeedResponseItemsItem[]>,
  bot: Bot,
) =>
  new Observable<{
    result: UserStoryFeedResponseItemsItem[];
    request: Request;
    bot: Bot;
  }>((subscribe) => {
    new Promise<UserStoryFeedResponseItemsItem[]>(async (res, rej) => {
      try {
        const ig = restoreState(bot.session);
        const stories = await getUserStory(ig, request.targetUser);
        subscribe.next({ result: stories, request, bot });
        subscribe.complete();
        res(stories);
      } catch (e) {
        subscribe.error({ e, request, bot });
        rej(e);
      }
    });
  });

export const processRequestHighlighted = (
  request: Request<UserStoryFeedResponseItemsItem[]>,
  bot: Bot,
) =>
  new Observable<{
    result: UserStoryFeedResponseItemsItem[];
    request: Request;
    bot: Bot;
  }>((subscribe) => {
    new Promise<UserStoryFeedResponseItemsItem[]>(async (res, rej) => {
      try {
        const ig = restoreState(bot.session);
        const stories = await getHighlighted(ig, request.targetUser);
        subscribe.next({ result: stories, request, bot });
        subscribe.complete();
        res(stories);
      } catch (e) {
        subscribe.error({ e, request, bot });
        rej(e);
      }
    });
  });

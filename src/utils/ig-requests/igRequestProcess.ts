import { AndroidIgpapi, UserStoryFeedResponseItemsItem } from '@igpapi/android';

import { Observable } from 'rxjs';
import { Request, Bot } from 'src/utils/ig-queque/types';
import { addEndTimeToRequest } from '../ig-queque/request/requestUtils';
import { getHighlighted, getUserStory } from './getStory';
import { restoreState } from './restoreState';

export const processRequestFactory =
  (
    requestFunction: (
      ig: AndroidIgpapi,
      targetUser: Request['targetUser'],
      params: Record<string, string | number>,
    ) => Promise<UserStoryFeedResponseItemsItem[]>,
  ) =>
  (request: Request<UserStoryFeedResponseItemsItem[]>, bot: Bot) =>
    new Observable<{
      result: UserStoryFeedResponseItemsItem[];
      request: Request;
      bot: Bot;
    }>((subscribe) => {
      new Promise<UserStoryFeedResponseItemsItem[]>(async (res, rej) => {
        try {
          const ig = restoreState(bot.session);
          const stories = await requestFunction(
            ig,
            request.targetUser,
            request.params,
          );

          subscribe.next({
            result: stories,
            request: addEndTimeToRequest(request),
            bot,
          });
          subscribe.complete();
          res(stories);
        } catch (e) {
          subscribe.error({ e, request: addEndTimeToRequest(request), bot });
          rej(e);
        }
      });
    });

export const processRequestStory = processRequestFactory(getUserStory);
export const processRequestHighlighted = processRequestFactory(getHighlighted);

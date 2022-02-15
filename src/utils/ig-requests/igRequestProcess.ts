import { AndroidIgpapi, UserStoryFeedResponseItemsItem } from '@igpapi/android';

import { Observable } from 'rxjs';
import { Request, Bot } from 'src/utils/ig-queque/types';
import { IgQuequeError } from '../ig-queque/request/error';
import { addEndTimeToRequest } from '../ig-queque/request/requestUtils';
import { getHighlighted, getHighlightedList, getUserStory } from './getStory';
import { restoreState } from './restoreState';

export const processRequestFactory =
  <T>(
    requestFunction: (
      ig: AndroidIgpapi,
      targetUser: Request['targetUser'],
      params: Record<string, string | number>,
    ) => Promise<T>,
  ) =>
  (request: Request<T>, bot: Bot) =>
    new Promise(async (res, rej) => {
      try {
        const ig = restoreState(bot.session);
        const stories = await requestFunction(
          ig,
          request.targetUser,
          request.params,
        );

        res({
          result: stories,
          request: addEndTimeToRequest(request),
          bot,
        });
      } catch (e) {
        // TODO fix this
        res(new IgQuequeError(e, addEndTimeToRequest(request), bot));
      }
    });

export const processRequestStory = processRequestFactory(getUserStory);
export const processRequestHighlighted = processRequestFactory(getHighlighted);
export const processRequestHighlightedList = processRequestFactory(getHighlightedList);

import {
  AndroidIgpapi,
  IgExactUserNotFoundError,
  UserStoryFeedResponseItemsItem,
} from '@igpapi/android';
import { from, mergeMap, Observable, of, skip } from 'rxjs';

export const getUserStory = async (
  ig: AndroidIgpapi,
  searchAccount: string,
): Promise<UserStoryFeedResponseItemsItem[]> => {
  let targetUser;
  try {
    targetUser = await ig.user.searchExact(searchAccount); // getting exact user by login
  } catch (e) {
    if (e instanceof IgExactUserNotFoundError) {
      return null;
    }
    throw e;
  }

  await new Promise((res) => setTimeout(res, 900));

  const reelsFeed = ig.feed.userStory({ userId: String(targetUser.pk) });

  await new Promise((res) => setTimeout(res, 500));
  // Iterate until the end of feed

  // return from(reelsFeed).pipe(
  //   skip(1),
  //   mergeMap((realsFeed) => realsFeed),
  // );

  debugger;

  // return from(reelsFeed);
  const response: UserStoryFeedResponseItemsItem[] = [];
  for await (const { items } of reelsFeed) {
    response.push(...items);
  }

  return response;
};

export const getHighlighted = async (
  ig: AndroidIgpapi,
  searchAccount: string,
): Promise<UserStoryFeedResponseItemsItem[]> => {
  let targetUser;
  try {
    targetUser = await ig.user.searchExact(searchAccount); // getting exact user by login
  } catch (e) {
    if (e instanceof IgExactUserNotFoundError) {
      return null;
    }
    throw e;
  }

  await new Promise((res) => setTimeout(res, 1000));

  const tray = await ig.highlights.highlightsTray(String(targetUser.pk)); // get the highlight covers
  const media = await ig.feed.reelsMedia({
    userIds: tray.tray.map((x) => x.id),
  });

  await new Promise((res) => setTimeout(res, 1000));

  const response = [];
  for await (const { items } of media) {
    response.push(...items);
  }

  return response;
};

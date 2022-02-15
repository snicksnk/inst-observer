import {
  AndroidIgpapi,
  IgExactUserNotFoundError,
  UserStoryFeedResponseItemsItem,
} from '@igpapi/android';
import CONFIG from 'src/config/common';

export const getUserStory = async (
  ig: AndroidIgpapi,
  searchAccount: string,
  params: Record<string, string | number>,
): Promise<UserStoryFeedResponseItemsItem[]> => {
  const skip = params?.skip ? Number(params.skip) : 0;
  let targetUser;

  try {
    targetUser = await ig.user.searchExact(searchAccount);
  } catch (e) {
    if (e instanceof IgExactUserNotFoundError) {
      return null;
    }
    throw e;
  }

  await new Promise((res) =>
    setTimeout(res, CONFIG.requests.pauseAfterGetUser),
  );

  const reelsFeed = ig.feed.userStory({ userId: String(targetUser.pk) });

  await new Promise((res) =>
    setTimeout(res, CONFIG.requests.pauseAfterGetStories),
  );

  const response: UserStoryFeedResponseItemsItem[] = [];
  for await (const { items } of reelsFeed) {
    response.push(...items);
    if (reelsFeed.hasMore()) {
      console.log('has moreee');
      await new Promise((res) =>
        setTimeout(res, CONFIG.requests.pauseAfterGetStories),
      );
    }
  }
  return response.slice(skip);
};

export const getHighlighted = async (
  ig: AndroidIgpapi,
  searchAccount: string,
  params: Record<string, string | number>,
): Promise<UserStoryFeedResponseItemsItem[]> => {
  const skip = params?.skip ? Number(params.skip) : 0;
  let targetUser;
  try {
    targetUser = await ig.user.searchExact(searchAccount); // getting exact user by login
  } catch (e) {
    if (e instanceof IgExactUserNotFoundError) {
      return null;
    }
    throw e;
  }

  await new Promise((res) =>
    setTimeout(res, CONFIG.requests.pauseAfterGetStories),
  );

  const tray = await ig.highlights.highlightsTray(String(targetUser.pk)); // get the highlight covers

  const step = CONFIG.requests.higlightStep;

  const response = [];

  debugger;
  for (let i = skip; i < tray.tray.length; i += step) {
    debugger;
    console.log(
      'step---',
      i,
      tray.tray.slice(i, i + step).map((x) => x.id),
    );
    await new Promise((res) => setTimeout(res, 1000));
    const media = await ig.feed.reelsMedia({
      userIds: tray.tray.slice(i, i + step).map((x) => x.id),
    });

    await new Promise((res) => setTimeout(res, 1000));

    for await (const { items } of media) {
      response.push(...items);
      if (media.hasMore()) {
        console.log('has moreee');
        await new Promise((res) =>
          setTimeout(res, CONFIG.requests.pauseAfterGetStories),
        );
      }
    }
  }

  return response;
};

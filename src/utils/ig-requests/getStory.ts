import { AndroidIgpapi, UserStoryFeedResponseItemsItem } from '@igpapi/android';

export const getUserStory = async (
  ig: AndroidIgpapi,
  searchAccount: string,
) => {
  const targetUser = await ig.user.searchExact(searchAccount); // getting exact user by login

  await new Promise((res) => setTimeout(res, 1000));

  const reelsFeed = ig.feed.userStory({ userId: String(targetUser.pk) });

  await new Promise((res) => setTimeout(res, 1000));
  // Iterate until the end of feed
  const response: UserStoryFeedResponseItemsItem[] = [];
  for await (const { items } of reelsFeed) {
    response.push(...items);
  }

  return response;
};

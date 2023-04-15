import { TweetWithUserAndFavorite } from './useTweets';

export const getFakeToggledFavoriteTweet = (
  tweet: TweetWithUserAndFavorite
) => {
  const isLiked = Boolean(tweet?.favorites.length);

  return {
    ...tweet,
    favorites: isLiked
      ? []
      : [
          {
            id: Date.now(),
          },
        ],
    _count: {
      favorites: tweet._count.favorites + (isLiked ? -1 : 1),
    },
  };
};

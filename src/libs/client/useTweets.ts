import useSWR from 'swr';
import { Tweet, User, Favorite } from '@prisma/client';

export interface TweetWithUserAndFavorite extends Tweet {
  user: User;
  favorites: Pick<Favorite, 'id'>[];
  _count: {
    favorites: number;
  };
}

interface TweetsResponse {
  ok: boolean;
  tweets?: TweetWithUserAndFavorite[];
}

export default function useTweets() {
  const { data, error, mutate } = useSWR<TweetsResponse>('/api/tweet');

  const optimisticUpdate = (newTweet: TweetWithUserAndFavorite) => {
    const exists = data?.tweets?.find((tweet) => tweet.id === newTweet.id);
    mutate(
      {
        ok: true,
        tweets: exists
          ? data?.tweets?.map((tweet) =>
              tweet.id === newTweet.id ? newTweet : tweet
            )
          : [newTweet, ...(data?.tweets || [])],
      },
      false
    );
  };

  return {
    tweets: data?.tweets ?? [],
    isLoading: !data && !error,
    optimisticUpdate,
  };
}

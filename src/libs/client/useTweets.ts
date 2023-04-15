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
    mutate(
      {
        ok: true,
        tweets: [newTweet, ...(data?.tweets || [])],
      },
      false
    );
  };

  const getTweetById = (id: number) => {
    return data?.tweets?.find((tweet) => tweet.id === id);
  };

  return {
    tweets: data?.tweets ?? [],
    isLoading: !data && !error,
    getTweetById,
    optimisticUpdate,
  };
}

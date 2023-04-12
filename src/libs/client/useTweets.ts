import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Tweet, User } from '@prisma/client';

export interface TweetWithUser extends Tweet {
  user: User;
}

interface TweetsResponse {
  ok: boolean;
  tweets?: TweetWithUser[];
}

export default function useTweets() {
  const { data, error } = useSWR<TweetsResponse>('/api/tweet');

  const getTweetById = (id: number) => {
    return data?.tweets?.find((tweet) => tweet.id === id);
  };

  return { tweets: data?.tweets, isLoading: !data && !error, getTweetById };
}

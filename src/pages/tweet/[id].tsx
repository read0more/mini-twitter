import { TweetWithUserAndFavorite } from '@/libs/client/useTweets';
import React, { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { withSsrSession } from '@/libs/server/withSession';
import routeGuard from '@/libs/server/routeGuard';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Link from 'next/link';
import Heart from '@/components/heart';
import useMutation from '@/libs/client/useMutation';
import { getFakeToggledFavoriteTweet } from '@/libs/client/favoriteHelper';

interface TweetResponse {
  ok: boolean;
  tweet?: TweetWithUserAndFavorite;
}

export default function TweetDetail({ id }: { id: number }) {
  const router = useRouter();
  const { cache, mutate: globalMutate } = useSWRConfig();
  const tweetCache = cache.get('/api/tweet')?.data
    ?.tweets as TweetWithUserAndFavorite[];
  const { data, isLoading, mutate } = useSWR<TweetResponse>(
    tweetCache ? null : `/api/tweet/${id}`
  );
  const tweet = tweetCache ? tweetCache.find((t) => t.id === id) : data?.tweet;
  const isLiked = Boolean(tweet?.favorites.length);
  const [toggleFavorite] = useMutation(`/api/tweet/${id}/favorite`);

  const tweetsMutate = () => {
    if (!tweet) return;

    globalMutate(
      '/api/tweet',
      {
        ok: true,
        tweets: tweetCache.map((_tweet) =>
          _tweet.id === tweet.id ? getFakeToggledFavoriteTweet(_tweet) : _tweet
        ),
      },
      false
    );
  };

  const tweetMutate = () => {
    if (!tweet) return;
    mutate(
      {
        ok: true,
        tweet: getFakeToggledFavoriteTweet(tweet),
      },
      false
    );
  };

  const handleToggleFavorite = () => {
    if (tweetCache) {
      tweetsMutate();
    } else {
      tweetMutate();
    }

    toggleFavorite({});
  };

  useEffect(() => {
    if (!data?.ok && !isLoading && !tweet) {
      alert('존재하지 않는 트윗입니다.');
      router.replace('/');
    }
  }, [data, router, isLoading, tweet]);

  return (
    <Layout>
      <Link
        href={`/`}
        className="text-blue-500 self-end text-2xl absolute left-0 top-[-30px]"
      >
        &larr;
      </Link>
      {tweet ? (
        <article
          className={`border border-gray-300 p-4 flex flex-col gap-2 relative`}
        >
          <h2 className="font-bold">
            {tweet.user.email} / {tweet.user.name}
          </h2>
          <div className="text-gray-700">
            <p>{tweet.text}</p>
          </div>
          <div className="text-gray-500 text-sm">
            {new Date(tweet.createdAt).toLocaleString()}
          </div>
          <div className="text-gray-500 text-sm">
            <Heart isFilled={isLiked} toggle={handleToggleFavorite} />{' '}
            {tweet._count?.favorites}
          </div>
        </article>
      ) : (
        <div>로딩중...</div>
      )}
    </Layout>
  );
}

export const getServerSideProps = withSsrSession(
  routeGuard('user', ({ params }) => {
    return {
      props: {
        id: Number(params?.id),
      },
    };
  })
);

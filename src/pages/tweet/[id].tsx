import { TweetWithUserAndFavorite } from '@/libs/client/useTweets';
import React, { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useMutation from '@/libs/client/useMutation';
import { withSsrSession } from '@/libs/server/withSession';
import routeGuard from '@/libs/server/routeGuard';
import { useRouter } from 'next/router';

interface TweetResponse {
  ok: boolean;
  tweet?: TweetWithUserAndFavorite;
}

export default function TweetDetail({ id }: { id: number }) {
  const router = useRouter();
  const { cache } = useSWRConfig();
  const tweetCache = cache.get('/api/tweet')?.data
    ?.tweets as TweetWithUserAndFavorite[];
  const { data, mutate, isLoading } = useSWR<TweetResponse>(
    tweetCache ? null : `/api/tweet/${id}`
  );
  const tweet = tweetCache ? tweetCache.find((t) => t.id === id) : data?.tweet;
  const [toggleFavorite] = useMutation(`/api/tweet/${id}/favorite`);
  const isLiked = tweet?.favorites.length;

  const handleToggleFavorite = async () => {
    if (!tweet) return;

    // TODO: favorites를 자기거만 가져오게 했으나...이런 이름이면 이름 헷갈리니까 isLiked 추가해서 바꿀필요 있음
    mutate(
      {
        ok: true,
        tweet: {
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
        },
      },
      false
    );
    toggleFavorite({});
  };

  useEffect(() => {
    if (!data?.ok && !isLoading && !tweet) {
      alert('존재하지 않는 트윗입니다.');
      router.replace('/');
    }
  }, [data, router, isLoading, tweet]);

  return (
    <article>
      {tweet ? (
        <>
          <h1>{tweet.text}</h1>
          <div>{tweet.user.name}</div>
          <button onClick={handleToggleFavorite}>
            {isLiked ? 'liked' : 'like'}
          </button>
        </>
      ) : (
        <div>로딩중...</div>
      )}
    </article>
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

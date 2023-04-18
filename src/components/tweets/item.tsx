import React from 'react';
import { TweetWithUserAndFavorite } from '@/libs/client/useTweets';
import Link from 'next/link';
import useMutation from '@/libs/client/useMutation';
import Heart from '../heart';
import { getFakeToggledFavoriteTweet } from '@/libs/client/favoriteHelper';

interface Props {
  tweet: TweetWithUserAndFavorite;
  optimisticUpdate: (tweet: TweetWithUserAndFavorite) => void;
}

export default function Item({ tweet, optimisticUpdate }: Props) {
  const [toggleFavorite] = useMutation(`/api/tweet/${tweet.id}/favorite`);
  const isLiked = Boolean(tweet?.favorites.length);

  const tweetsMutate = () => {
    optimisticUpdate(getFakeToggledFavoriteTweet(tweet));
  };

  const handleToggleFavorite = () => {
    tweetsMutate();
    toggleFavorite({});
  };

  return (
    <li
      className={`border border-gray-300 p-4 flex flex-col gap-2 hover:bg-gray-300 transition-color duration-500 relative`}
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
      <Link
        href={`/tweet/${tweet.id}`}
        className="text-blue-500 self-end text-2xl absolute right-3 bottom-2"
      >
        &rarr;
      </Link>
    </li>
  );
}

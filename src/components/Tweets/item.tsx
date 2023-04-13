import React from 'react';
import { TweetWithUserAndFavorite } from '@/libs/client/useTweets';
import Link from 'next/link';

interface Props {
  tweet: TweetWithUserAndFavorite;
  getTweetById: (id: number) => void;
}

export default function Item({ tweet, getTweetById }: Props) {
  return (
    <li className="border">
      <h2>
        {tweet.user.email} / {tweet.user.name}
      </h2>
      <div>
        <p>{tweet.text}</p>
      </div>
      <Link href={`/tweet/${tweet.id}`}>-&gt;</Link>
    </li>
  );
}

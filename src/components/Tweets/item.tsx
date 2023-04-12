import React from 'react';
import { TweetWithUser } from '@/libs/client/useTweets';

interface Props {
  tweet: TweetWithUser;
  getTweetById: (id: number) => void;
}

export default function Item({ tweet, getTweetById }: Props) {
  return (
    <li onClick={() => console.log(getTweetById(tweet.id))} className="border">
      <h2>
        {tweet.user.email} / {tweet.user.name}
      </h2>
      <div>
        <p>{tweet.text}</p>
      </div>
    </li>
  );
}

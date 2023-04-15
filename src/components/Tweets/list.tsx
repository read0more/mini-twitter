import useTweets from '@/libs/client/useTweets';
import React from 'react';
import Item from './item';

export default function List() {
  const { tweets, isLoading, optimisticUpdate } = useTweets();
  return isLoading ? (
    <div>loading...</div>
  ) : (
    <ul>
      {tweets &&
        tweets.map((tweet) => (
          <Item
            key={tweet.id}
            tweet={tweet}
            optimisticUpdate={optimisticUpdate}
          />
        ))}
    </ul>
  );
}

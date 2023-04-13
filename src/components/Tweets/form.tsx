import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import schema, { SchemaType } from '@/schemas/tweets/create';
import { zodResolver } from '@hookform/resolvers/zod';
import useMutation from '@/libs/client/useMutation';
import { ResponseType } from '@/libs/server/withHandler';
import useTweets from '@/libs/client/useTweets';
import { TweetWithUserAndFavorite } from '@/libs/client/useTweets';

type TweetResponseType = ResponseType & {
  tweet: TweetWithUserAndFavorite;
};

export default function PostTweetForm() {
  const { tweets, optimisticUpdate } = useTweets();
  const [isCreateTweet, setIsCreateTweet] = useState(false);
  const [mutation, { loading: createTweetLoading, data }] =
    useMutation<TweetResponseType>('api/tweet');
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SchemaType) => {
    mutation(data);
  };

  useEffect(() => {
    if (data?.ok && tweets[0].id !== data.tweet.id) {
      reset();
      setIsCreateTweet(false);
      optimisticUpdate(data.tweet);
      return;
    }

    if (data?.error) {
      setError('text', {
        type: 'server',
        message: '작성에 실패했습니다.',
      });
    }
  }, [setIsCreateTweet, data, setError, reset, tweets, optimisticUpdate]);

  return (
    <>
      <div
        className="fixed bottom-0 right-0 m-10"
        onClick={() => setIsCreateTweet(true)}
      >
        <button className="bg-blue-500 text-white rounded-full w-12 h-12 flex justify-center items-center">
          +
        </button>
      </div>
      {isCreateTweet && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-white w-1/2 h-1/2 shadow-2xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full flex flex-col justify-between"
            >
              <textarea
                className="w-full h-full resize-none"
                {...register('text')}
              ></textarea>
              {errors.text && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.text.message}
                </p>
              )}
              <button type="submit" disabled={createTweetLoading}>
                {createTweetLoading ? '전송중...' : '트윗하기'}
              </button>
            </form>
            <div
              className="absolute top-0 right-0 m-5"
              onClick={() => setIsCreateTweet(false)}
            >
              <button className="bg-blue-500 text-white rounded-full w-12 h-12 flex justify-center items-center">
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

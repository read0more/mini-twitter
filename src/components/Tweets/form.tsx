import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import schema, { SchemaType } from '@/schemas/tweets/create';
import { zodResolver } from '@hookform/resolvers/zod';
import useMutation from '@/libs/client/useMutation';
import { ResponseType } from '@/libs/server/withHandler';
import useTweets from '@/libs/client/useTweets';
import useUser from '@/libs/client/useUser';

export default function PostTweetForm() {
  const { optimisticUpdate } = useTweets();
  const { user } = useUser();
  const [isCreateTweet, setIsCreateTweet] = useState(false);
  const [mutation, { loading: createTweetLoading, data }] =
    useMutation<ResponseType>('api/tweet');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SchemaType) => {
    mutation(data);
  };

  useEffect(() => {
    if (data?.ok && user) {
      setIsCreateTweet(false);
      const currentDate = new Date();
      optimisticUpdate({
        id: data.id,
        text: data.text,
        createdAt: currentDate,
        updatedAt: currentDate,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
      return;
    }

    if (data?.error) {
      setError('text', {
        type: 'server',
        message: '작성에 실패했습니다.',
      });
    }
  }, [setIsCreateTweet, data, setError]);

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

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import schema, { SchemaType } from '@/schemas/tweets/create';
import { zodResolver } from '@hookform/resolvers/zod';
import useMutation from '@/libs/client/useMutation';
import { ResponseType } from '@/libs/server/withHandler';
import useTweets from '@/libs/client/useTweets';
import { TweetWithUserAndFavorite } from '@/libs/client/useTweets';
import useModal from '@/libs/client/useModal';
import Modal from '@/components/modal';

type TweetResponseType = ResponseType & {
  tweet: TweetWithUserAndFavorite;
};

export default function PostTweetForm() {
  const { tweets, optimisticUpdate } = useTweets();
  const [mutation, { loading: createTweetLoading, data }] =
    useMutation<TweetResponseType>('api/tweet');
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });
  const { isOpen, toggle } = useModal();

  const onSubmit = (data: SchemaType) => {
    mutation(data);
  };

  useEffect(() => {
    if (data?.ok && tweets[0]?.id !== data.tweet.id) {
      reset();
      toggle();
      optimisticUpdate(data.tweet);
      return;
    }

    if (data?.error) {
      setError('text', {
        type: 'server',
        message: '작성에 실패했습니다.',
      });
    }
  }, [toggle, data, setError, reset, tweets, optimisticUpdate]);

  useEffect(() => {
    if (!isOpen) return;
    setFocus('text');
  }, [setFocus, isOpen]);

  return (
    <>
      <div className="fixed bottom-0 right-0 m-10" onClick={() => toggle()}>
        <button className="bg-blue-500 text-white rounded-full w-12 h-12 flex justify-center items-center">
          +
        </button>
      </div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <>
          <form
            onSubmit={handleSubmit(onSubmit, console.log)}
            className="h-full flex flex-col justify-between"
          >
            <textarea
              className="w-full resize-none flex-1"
              {...register('text')}
            ></textarea>
            <button
              type="submit"
              disabled={createTweetLoading}
              className="bg-blue-500 rounded-b-lg text-white p-2"
            >
              {createTweetLoading ? '전송중...' : '트윗하기'}
            </button>
          </form>
          {errors.text && (
            <p className="bg-white text-sm text-red-600">
              {errors.text.message}
            </p>
          )}
        </>
      </Modal>
    </>
  );
}

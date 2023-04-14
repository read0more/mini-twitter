import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import schema, { SchemaType } from '@/schemas/users/enter';
import useMutation from '@/libs/client/useMutation';
import { ResponseType } from '@/libs/server/withHandler';

interface Props {
  goToConfirm: (email: string) => void;
}

export default function EnterForm({ goToConfirm }: Props) {
  const [mutation, { loading, data, error: sendEmailError }] =
    useMutation<ResponseType>('api/users/enter');
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    mutation(data);
  };

  useEffect(() => {
    if (data?.ok) {
      goToConfirm(getValues().email);
    }
  }, [data, goToConfirm, getValues]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <label className="flex-1 mr-2">
          <input
            type="email"
            {...register('email')}
            placeholder="이메일을 입력해주세요."
            className={`w-full border-2 border-gray-300 rounded-lg p-2 ${
              errors.email && 'focus:outline-none focus:border-red-600'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1 absolute">
              {errors.email.message}
            </p>
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded-md p-2"
        >
          {loading ? '전송중...' : '인증번호 전송'}
        </button>
      </form>
      <div>
        {sendEmailError && (
          <p className="text-sm text-red-600 mt-1">
            인증번호 전송에 실패했습니다.
          </p>
        )}
      </div>
    </>
  );
}

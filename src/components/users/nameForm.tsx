import useMutation from '@/libs/client/useMutation';
import schema, { SchemaType } from '@/schemas/users/setName';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ResponseType } from '@/libs/server/withHandler';
import { useRouter } from 'next/router';
import { User } from '@prisma/client';

interface Props {
  endProcess: (user: User) => void;
}

export default function NameForm({ endProcess }: Props) {
  const router = useRouter();
  const [mutation, { loading, data, error }] =
    useMutation<ResponseType>('api/users/me');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    mutation(data);
  };

  useEffect(() => {
    if (data?.ok) {
      endProcess(data.user);
    }
  }, [data, endProcess]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex">
        <label className="flex-1 mr-2">
          <input
            type="text"
            {...register('name')}
            placeholder="이름을 입력해주세요."
            className={`w-full border-2 border-gray-300 rounded-lg p-2 ${
              errors.name && 'focus:outline-none focus:border-red-600'
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1 absolute">
              {errors.name.message}
            </p>
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded-md p-2"
        >
          {loading ? '설정중...' : '이름 설정'}
        </button>
      </form>
      <div>
        {(error || data?.error) && (
          <p className="text-sm text-red-600 mt-1">이름 설정에 실패했습니다.</p>
        )}
      </div>
    </>
  );
}

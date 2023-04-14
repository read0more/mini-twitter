import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import schema, { SchemaType } from '@/schemas/users/confirm';
import useMutation from '@/libs/client/useMutation';
import { ResponseType } from '@/libs/server/withHandler';
import { User } from '@prisma/client';

interface Props {
  email: string;
  goToName: () => void;
  endProcess: (user: User) => void;
}

export default function ConfirmForm({ email, goToName, endProcess }: Props) {
  const [mutation, { loading, data, error: tokenCheckError }] =
    useMutation<ResponseType>('api/users/confirm');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { email },
  });

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    mutation(data);
  };

  useEffect(() => {
    if (data?.ok) {
      data.user?.name ? endProcess(data.user) : goToName();
    }
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <input type="text" {...register('payload')} />
          {errors.payload && (
            <p className="text-sm text-red-600 mt-1">
              {errors.payload.message}
            </p>
          )}
        </label>
        <button type="submit" disabled={loading}>
          {loading ? '확인중...' : '인증번호 확인'}
        </button>
      </form>
      <div>
        {(tokenCheckError || data?.error) && (
          <p className="text-sm text-red-600 mt-1">
            인증번호 확인에 실패했습니다.
          </p>
        )}
      </div>
    </>
  );
}

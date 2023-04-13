import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import schema, { SchemaType } from '@/schemas/users/confirm';
import useMutation from '@/libs/client/useMutation';
import { ResponseType } from '@/libs/server/withHandler';
import { useRouter } from 'next/router';
import useUser from '@/libs/client/useUser';

interface Props {
  email: string;
}

export default function ConfirmForm({ email }: Props) {
  const router = useRouter();
  const [mutation, { loading, data, error: tokenCheckError }] =
    useMutation<ResponseType>('api/users/confirm');
  const { mutate: mutateUser } = useUser();

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
      mutateUser(
        {
          ok: true,
          user: data.user,
        },
        false
      );

      router.replace('/');
    }
  }, [data, router, loading, mutateUser]);

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

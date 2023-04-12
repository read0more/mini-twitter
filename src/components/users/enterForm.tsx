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
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <input type="email" {...register('email')} />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </label>
        <button type="submit" disabled={loading}>
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

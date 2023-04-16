import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { User } from '@prisma/client';

interface ProfileResponse {
  ok: boolean;
  user?: User;
}

export default function useUser() {
  const { data, error, mutate, isLoading } =
    useSWR<ProfileResponse>('/api/users/me');
  const router = useRouter();

  const logout = async () => {
    const response = await fetch('/api/users/logout');
    const result = await response.json();

    if (result.ok) {
      router.replace('/log-in');
      return mutate({ ok: false }, false);
    }

    throw new Error('Unknown error');
  };

  useEffect(() => {
    if (data?.user) {
      mutate(
        {
          ...data,
        },
        false
      );
    }
  }, [data, mutate]);

  return { user: data?.user, isLoading, mutate, logout };
}

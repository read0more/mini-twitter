import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { User } from '@prisma/client';

interface ProfileResponse {
  ok: boolean;
  user?: User;
}

export default function useUser({ redirectIfNotFound = true } = {}) {
  const { data, error, mutate, isLoading } =
    useSWR<ProfileResponse>('/api/users/me');
  const router = useRouter();

  const logout = async () => {
    const response = await fetch('/api/users/logout');
    const result = await response.json();

    if (result.ok) {
      return mutate({ ok: false }, false);
    }

    throw new Error('Unknown error');
  };

  useEffect(() => {
    if (redirectIfNotFound && data && !data.ok) {
      router.replace('/log-in');
    } else if (data?.user) {
      mutate(
        {
          ...data,
        },
        false
      );
    }
  }, [data, router, mutate, redirectIfNotFound, isLoading]);

  return { user: data?.user, isLoading, mutate, logout };
}

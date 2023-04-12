import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { User } from '@prisma/client';

interface ProfileResponse {
  ok: boolean;
  user: User;
}

export default function useUser() {
  const { data, error, mutate } = useSWR<ProfileResponse>('/api/users/me');
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/log-in');
    } else if (data?.user) {
      mutate(
        {
          ...data,
        },
        false
      );
    }
  }, [data, router, mutate]);
  return { user: data?.user, isLoading: !data && !error };
}

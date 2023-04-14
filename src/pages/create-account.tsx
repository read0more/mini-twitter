import React, { useState } from 'react';
import EnterForm from '@/components/users/enterForm';
import ConfirmForm from '@/components/users/confirmForm';
import { withSsrSession } from '@/libs/server/withSession';
import routeGuard from '@/libs/server/routeGuard';
import NameForm from '@/components/users/nameForm';
import useUser from '@/libs/client/useUser';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';

type Step = 'enter' | 'confirm' | 'name';

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('enter');
  const { mutate: mutateUser } = useUser();

  const goToConfirm = (email: string) => {
    setEmail(email);
    setStep('confirm');
  };

  const goToName = () => {
    setStep('name');
  };

  const endProcess = (user: User) => {
    mutateUser(
      {
        ok: true,
        user,
      },
      false
    );

    router.replace('/');
  };

  return (
    <div>
      {step === 'enter' && <EnterForm goToConfirm={goToConfirm} />}
      {step === 'confirm' && (
        <ConfirmForm
          email={email}
          goToName={goToName}
          endProcess={endProcess}
        />
      )}
      {step === 'name' && <NameForm endProcess={endProcess} />}
    </div>
  );
}

export const getServerSideProps = withSsrSession(routeGuard('guest'));

import React, { useState } from 'react';
import EnterForm from '@/components/users/enterForm';
import ConfirmForm from '@/components/users/confirmForm';
import { withSsrSession } from '@/libs/server/withSession';
import routeGuard from '@/libs/server/routeGuard';

type Step = 'enter' | 'confirm';

export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('enter');

  const goToConfirm = (email: string) => {
    setEmail(email);
    setStep('confirm');
  };

  return (
    <div>
      {step === 'enter' ? (
        <EnterForm goToConfirm={goToConfirm} />
      ) : (
        <ConfirmForm email={email} />
      )}
    </div>
  );
}

export const getServerSideProps = withSsrSession(routeGuard('guest'));

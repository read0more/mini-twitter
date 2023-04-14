import React, { useEffect, useState } from 'react';
import EnterForm from '@/components/users/enterForm';
import ConfirmForm from '@/components/users/confirmForm';
import { withSsrSession } from '@/libs/server/withSession';
import routeGuard from '@/libs/server/routeGuard';
import NameForm from '@/components/users/nameForm';
import useUser from '@/libs/client/useUser';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import useModal from '@/libs/client/useModal';
import Modal from '@/components/modal';

type Step = 'enter' | 'confirm' | 'name';

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('enter');
  const { mutate: mutateUser } = useUser();
  const { isOpen, toggle } = useModal();

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

  useEffect(() => {
    !isOpen && toggle();
  }, [isOpen, toggle]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      isAllowClose={false}
      alignCenter={true}
    >
      {step === 'enter' && <EnterForm goToConfirm={goToConfirm} />}
      {step === 'confirm' && (
        <ConfirmForm
          email={email}
          goToName={goToName}
          endProcess={endProcess}
        />
      )}
      {step === 'name' && <NameForm endProcess={endProcess} />}
    </Modal>
  );
}

export const getServerSideProps = withSsrSession(routeGuard('guest'));

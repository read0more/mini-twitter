import Image from 'next/image';
import React from 'react';

interface Props {
  toggle: () => void;
  isFilled?: boolean;
}

export default function Heart({ toggle, isFilled }: Props) {
  return (
    <Image
      src={isFilled ? '/heart-filled.png' : '/heart.png'}
      width={20}
      height={20}
      alt="favorite"
      className="inline"
      onClick={toggle}
    />
  );
}

import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <main className="h-full min-h-screen py-10">
      <section className="h-12 w-full max-w-2xl bg-white px-10 text-lg font-medium text-gray-800 m-auto relative">
        {children}
      </section>
    </main>
  );
}

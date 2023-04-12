import Layout from '@/components/layout';
import type { NextPage } from 'next';
import useUser from '@/libs/client/useUser';

const Home: NextPage = () => {
  const { user, isLoading, logout } = useUser();

  if (isLoading) return <div>로딩중...</div>;
  return (
    <Layout>
      <div>{JSON.stringify(user)}</div>
      <button onClick={logout}>logout</button>
    </Layout>
  );
};

export default Home;

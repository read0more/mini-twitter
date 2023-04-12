import Layout from '@/components/layout';
import type { NextPage, NextPageContext } from 'next';
import useUser from '@/libs/client/useUser';

const Home: NextPage = () => {
  const { isLoading } = useUser();

  if (isLoading) return <div>로딩중...</div>;
  return (
    <Layout>
      <div>123</div>
    </Layout>
  );
};

export default Home;

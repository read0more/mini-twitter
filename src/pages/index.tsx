import Layout from '@/components/layout';
import type { NextPage } from 'next';
import useUser from '@/libs/client/useUser';
import List from '@/components/tweets/list';
import PostTweetForm from '@/components/tweets/form';
import { withSsrSession } from '@/libs/server/withSession';
import routeGuard from '@/libs/server/routeGuard';

const Home: NextPage = () => {
  const { user, isLoading, logout } = useUser();

  if (isLoading) return <div>로딩중...</div>;
  return user ? (
    <Layout>
      <List />
      <div>{JSON.stringify(user)}</div>
      <button onClick={logout}>logout</button>
      <PostTweetForm />
    </Layout>
  ) : null;
};

export default Home;

export const getServerSideProps = withSsrSession(routeGuard('user'));

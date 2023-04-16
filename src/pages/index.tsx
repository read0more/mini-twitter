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
      <div className="fixed top-0 right-0 m-10" onClick={logout}>
        <button className="bg-blue-500 text-white rounded-full flex justify-center items-center w-24">
          logout
        </button>
      </div>
      <PostTweetForm />
    </Layout>
  ) : null;
};

export default Home;

export const getServerSideProps = withSsrSession(routeGuard('user'));

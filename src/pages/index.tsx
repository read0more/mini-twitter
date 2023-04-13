import Layout from '@/components/layout';
import type { NextPage } from 'next';
import useUser from '@/libs/client/useUser';
import List from '@/components/tweets/list';
import PostTweetForm from '@/components/tweets/form';

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
  ) : (
    <></>
  );
};

export default Home;

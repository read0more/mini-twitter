import { GetServerSidePropsContext } from 'next';

type ReturnProps = {
  props: {};
};

const defaultReturnProps = {
  props: {},
};

export default function routeGuard(
  mode: 'user' | 'guest',
  callback?: (context: GetServerSidePropsContext) => ReturnProps
) {
  return (context: GetServerSidePropsContext) => {
    const { req } = context;
    const user = req.session.user;

    if (mode === 'user' && !user) {
      return {
        redirect: {
          destination: '/log-in',
          permanent: false,
        },
      };
    }

    if (mode === 'guest' && user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return callback ? callback(context) : defaultReturnProps;
  };
}

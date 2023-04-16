import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: process.env.IRON_COOKIE_NAME!,
  password: process.env.IRON_COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(fn: any) {
  return withIronSessionSsr(fn, cookieOptions);
}

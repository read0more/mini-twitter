import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  // cookieName: process.env.IRON_COOKIE_NAME!,
  // password: process.env.IRON_COOKIE_PASSWORD!,
  cookieName: 'mini_twitter',
  password: 'just_for_test_mxjj(Z%aSZvAxgEY4)4w4QNjwc$pDngZV8)rCgy$%vyjXR',
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(fn: any) {
  return withIronSessionSsr(fn, cookieOptions);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';
import schema from '@/schemas/users/confirm';
import withError from '@/libs/server/withError';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  async function insideHandler() {
    const { payload, email } = schema.parse(req.body);
    const foundTokens = await prismaClient.token.findMany({
      where: {
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });

    if (!foundTokens || foundTokens[0].payload !== payload) {
      throw new z.ZodError([
        {
          code: 'custom',
          path: ['payload'],
          message: '잘못된 인증번호 입니다.',
        },
      ]);
    }

    const userId = foundTokens[0].userId;
    req.session.user = {
      id: userId,
    };

    await req.session.save();
    await prismaClient.token.deleteMany({
      where: {
        userId,
      },
    });

    res.json({ ok: true, user: foundTokens[0].user });
  }

  withError(req, res)(insideHandler);
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
    isPrivate: false,
  })
);

import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import withError from '@/libs/server/withError';

const schema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(4, { message: '4자 이상 입력해주세요.' })
    .max(10, { message: '최대 10자 까지 입력가능합니다.' }),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  async function insideHandler() {
    const userFromBody = schema.parse(req.body);
    const existUser = await prismaClient.user.findFirst({
      where: {
        email: userFromBody.email,
      },
    });

    if (existUser) {
      throw new z.ZodError([
        {
          code: 'custom',
          path: ['email'],
          message: '이미 존재하는 이메일입니다.',
        },
      ]);
    }

    const user = await prismaClient.user.create({
      data: userFromBody,
    });

    return res.status(200).json({
      ok: true,
      user,
    });
  }

  withError(req, res)(insideHandler);
}

export default withHandler({
  methods: ['POST'],
  handler,
});

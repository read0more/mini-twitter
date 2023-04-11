import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional().default(''),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  try {
    const { email, name } = schema.parse(req.body);

    const payload = Math.floor(100000 + Math.random() * 900000) + '';
    const token = await prismaClient.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              email,
              name,
            },
          },
        },
      },
    });

    const sendMailResult = await fetch(process.env.SEND_MAIL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        payload,
      }),
    });

    if (!sendMailResult.ok) {
      throw new z.ZodError([
        {
          code: 'custom',
          path: [],
          message: '메일 발송에 실패했습니다.',
        },
      ]);
    }

    return res.status(200).json({
      ok: true,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: e.issues,
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'Unknown error',
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
    isPrivate: false,
  })
);

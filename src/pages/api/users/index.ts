import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';

const schema = z
  .object({
    email: z.string().email(),
    phone: z
      .string()
      .regex(/^[0-9]{11}$/, { message: '핸드폰 번호는 11자리만' }),
    name: z
      .string()
      .min(4, { message: '2자 이상 입력' })
      .max(10, { message: '최대 10자 까지' }),
  })
  .partial({
    email: true,
    phone: true,
  })
  .refine(({ email, phone }) => email || phone, {
    message: '이메일 또는 핸드폰 번호를 입력',
    path: ['email', 'phone'],
  });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  try {
    const result = schema.parse(req.body);
    const existUser = await prismaClient.user.findFirst({
      where: {
        OR: [
          {
            email: result.email,
          },
          {
            phone: result.phone,
          },
        ],
      },
    });

    if (existUser) {
      throw new z.ZodError([
        {
          code: 'custom',
          path: ['email', 'phone'],
          message: '이미 존재하는 이메일 또는 핸드폰 번호',
        },
      ]);
    }

    const user = await prismaClient.user.create({
      data: result,
    });

    return res.status(200).json({
      ok: true,
      user,
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

export default withHandler({
  methods: ['POST'],
  handler,
});

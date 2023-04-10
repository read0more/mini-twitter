import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';

// TODO: 람다로 인증코드 보낼지, 아니면 그냥 DB에 비번 넣어서 관리할지 정하면 그 때 변경
const schema = z
  .object({
    email: z.string().email(),
    phone: z
      .string()
      .regex(/^[0-9]{11}$/, { message: '핸드폰 번호는 11자리만' }),
    // password: z.string(),
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
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      ok: false,
      error: result.error.issues,
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      OR: [
        {
          email: result.data.email,
        },
        {
          phone: result.data.phone,
        },
      ],
    },
  });

  if (!user) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: [],
        message: '로그인에 실패했습니다.',
      },
    ]);
  }

  req.session.user = {
    id: user.id,
  };
  await req.session.save();

  return res.status(200).json({
    ok: true,
    user,
  });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
);

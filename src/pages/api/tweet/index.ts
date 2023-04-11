import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';

const schema = z.object({
  text: z.string().min(1, '내용을 입력해주세요.'),
});

const SIZE = 10;
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'POST') {
    const id = req.session.user?.id ?? 0;
    try {
      const result = schema.parse(req.body);
      const user = await prismaClient.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(401).json({
          ok: false,
          error: '로그인이 필요합니다.',
        });
      }

      const tweet = await prismaClient.tweet.create({
        data: {
          text: result.text,
          user: {
            connect: {
              id,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        tweet,
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
  } else {
    const { page: _page } = req.query;
    const page = Number(_page) || 1;

    const tweets = await prismaClient.tweet.findMany({
      take: SIZE,
      skip: (page - 1) * SIZE,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json({
      ok: true,
      tweets,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['POST', 'GET'],
    handler,
  })
);

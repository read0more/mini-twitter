import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';
import schema from '@/schemas/tweets/create';

const SIZE = 10;
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'POST') {
    const id = req.session.user?.id;
    try {
      const result = schema.parse(req.body);
      const user = await prismaClient.user.findUnique({
        where: {
          id,
        },
      });

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
        favorites: {
          select: {
            id: true,
          },
          where: {
            userId: req.session.user?.id,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
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

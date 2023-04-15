import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';
import schema from '@/schemas/tweets/create';
import withError from '@/libs/server/withError';

const SIZE = 10;
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  async function insideHandler() {
    if (req.method === 'POST') {
      const id = req.session.user?.id;
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
        tweet,
      });
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

  withError(req, res)(insideHandler);
}

export default withApiSession(
  withHandler({
    methods: ['POST', 'GET'],
    handler,
  })
);

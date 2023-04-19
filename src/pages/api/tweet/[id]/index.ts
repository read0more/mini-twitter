import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';
import schema from '@/schemas/tweets/detail';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = schema.parse(req.query);
  const tweet = await prismaClient.tweet.findUnique({
    where: {
      id,
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

  if (!tweet) {
    return res.status(404).json({
      ok: false,
      error: 'Tweet not found',
    });
  }

  return res.status(200).json({
    ok: true,
    tweet,
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);

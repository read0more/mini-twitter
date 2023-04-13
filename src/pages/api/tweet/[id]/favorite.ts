import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';
import withError from '@/libs/server/withError';

const schema = z.object({
  id: z.coerce.number(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  async function insideHandler() {
    const { id } = schema.parse(req.query);
    const alreadyFav = await prismaClient.favorite.findFirst({
      where: {
        userId: req.session.user?.id,
        tweetId: id,
      },
    });

    if (alreadyFav) {
      await prismaClient.favorite.delete({
        where: {
          id: alreadyFav.id,
        },
      });
    } else {
      await prismaClient.favorite.create({
        data: {
          user: {
            connect: {
              id: req.session.user?.id,
            },
          },
          tweet: {
            connect: {
              id,
            },
          },
        },
      });
    }

    return res.status(200).json({
      ok: true,
    });
  }

  withError(req, res)(insideHandler);
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  })
);

import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import z from 'zod';
import { withApiSession } from '@/libs/server/withSession';

const schema = z.object({
  id: z.coerce.number(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  try {
    const { id } = schema.parse(req.query);
    const tweet = await prismaClient.tweet.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
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
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);

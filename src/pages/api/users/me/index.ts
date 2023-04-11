import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const id = req.session.user?.id;
  if (req.method === 'GET') {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    return res.status(200).json({
      ok: true,
      user,
    });
  } else if (req.method === 'POST') {
    try {
      const { name } = schema.parse(req.body);
      const user = await prismaClient.user.update({
        where: {
          id,
        },
        data: {
          name,
        },
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
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);

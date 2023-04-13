import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';
import { z } from 'zod';
import withError from '@/libs/server/withError';

const schema = z.object({
  name: z.string(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const id = req.session.user?.id;
  async function insideHandler() {
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
    }
  }

  withError(req, res)(insideHandler);
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);

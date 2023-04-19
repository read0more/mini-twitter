import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';

import schema from '@/schemas/users/setName';

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

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  })
);

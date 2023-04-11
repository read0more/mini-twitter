import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/libs/server/prismaClient';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const id = req.session.user?.id;
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  return res.status(200).json({
    ok: true,
    user,
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);

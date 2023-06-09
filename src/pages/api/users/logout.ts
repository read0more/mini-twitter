import type { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  req.session.destroy();

  return res.status(200).json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);

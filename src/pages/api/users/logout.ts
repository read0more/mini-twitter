import type { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@/libs/server/withHandler';
import { withApiSession } from '@/libs/server/withSession';
import withError from '@/libs/server/withError';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  async function insideHandler() {
    req.session.destroy();

    return res.status(200).json({
      ok: true,
    });
  }

  withError(req, res)(insideHandler);
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);

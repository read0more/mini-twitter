import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default function withError(req: NextApiRequest, res: NextApiResponse) {
  return async function (
    handler: (req: NextApiRequest, res: NextApiResponse) => void
  ) {
    try {
      await handler(req, res);
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
  };
}

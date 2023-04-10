import { NextApiRequest, NextApiResponse } from 'next';

interface SuccessResponseType {
  ok: true;
  [key: string]: any;
}

interface ErrorResponseType {
  ok: false;
  error: any;
}

export type ResponseType = SuccessResponseType | ErrorResponseType;

type method = 'GET' | 'POST' | 'DELETE';

interface ConfigType {
  methods: method[];
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => void | Promise<unknown>;
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  isPrivate = true,
  handler,
}: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as method)) {
      return res.status(405).end();
    }

    // TODO: iron-session 적용하면 private에 대한 처리

    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
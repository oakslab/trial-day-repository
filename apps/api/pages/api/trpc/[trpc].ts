import 'reflect-metadata';
import * as trpcNext from '@trpc/server/adapters/next';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { appRouter } from '../../../src/app';
import { createContext } from '../../../src/trpc/context';
import { addHeadersToRes } from '../../../src/utils/headers';

const nextApiHandler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

export default async function handler(
  nextReq: NextApiRequest,
  nextRes: NextApiResponse,
) {
  const { req, res } = addHeadersToRes(nextReq, nextRes);
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
  } else {
    // finally pass the request on to the tRPC handler
    await nextApiHandler(req, res);
  }
}

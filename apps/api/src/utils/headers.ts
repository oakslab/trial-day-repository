import type { NextApiRequest, NextApiResponse } from 'next/types';

export const addHeadersToRes = <R>(
  req: NextApiRequest,
  res: NextApiResponse<R>,
) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*'); // Include headers: sentry-trace, baggage
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  return {
    req,
    res,
  };
};

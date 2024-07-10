import { initTRPC } from '@trpc/server';
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import superjson from 'superjson';
import type { EndpointMeta, RequestContext } from './types';

export const t = initTRPC
  .context<RequestContext>()
  .meta<EndpointMeta>()
  .create({
    transformer: superjson,
    errorFormatter: ({ shape }) => {
      if (process.env.ENVIRONMENT === 'local') {
        return shape;
      }

      return {
        message: 'Internal Server Error (500)',
        code: TRPC_ERROR_CODES_BY_KEY.INTERNAL_SERVER_ERROR,
        data: {
          code: 'INTERNAL_SERVER_ERROR',
          httpStatus: 500,
          stack: 'API_ERROR',
        },
      };
    },
  });

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

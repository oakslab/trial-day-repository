import { TRPCError } from '@trpc/server';
import { topLevelRole } from 'common';
import { transactionMiddleware } from '../lib/db/transactionMiddleware';
import { tracingMiddleware } from '../middlewares/tracingMiddleware';
import { auditLogMiddleware } from './middlewares/audit-logger';
import { checkPermissionMiddleware } from './middlewares/authorization';
import { requestLoggerMiddleware } from './middlewares/request-logger';
import type { ProtectedContext } from './types';
import { procedure } from './index';

export const publicProcedure = procedure
  .use(tracingMiddleware)
  .use(requestLoggerMiddleware)
  .use(transactionMiddleware);

export const protectedProcedure = publicProcedure
  .use(async (opts) => {
    if (!opts.ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        ...opts.ctx,
        user: opts.ctx.user,
      } satisfies ProtectedContext,
    });
  })
  .use(auditLogMiddleware)
  .use(checkPermissionMiddleware);

export const adminProcedure = protectedProcedure.use(async (opts) => {
  if (opts.ctx.user.role === topLevelRole) {
    return opts.next(opts);
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' });
});

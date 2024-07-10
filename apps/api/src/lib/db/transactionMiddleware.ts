import { t } from '../../trpc';
import { TransactionService } from './transactionService';

export const transactionMiddleware = t.middleware(async (opts) => {
  if (opts.type !== 'mutation') {
    return opts.next();
  }

  const transactionService = opts.ctx.container.get(TransactionService);

  return transactionService.enter(() => opts.next());
});

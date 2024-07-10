import { AsyncLocalStorage } from 'async_hooks';
import { TRPCError } from '@trpc/server';
import { PrismaClient } from 'database';
import { Service } from 'typedi';
import { LoggerService } from '../../services/logger';
import { PrismaService } from './prisma';

export type PrismaTransaction = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export type TransactionResult = {
  ok: boolean;
  error?: TRPCError;
};

@Service()
export class TransactionService {
  private static transactionStorage =
    new AsyncLocalStorage<PrismaTransaction>();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {
    if ((prismaService as unknown as { __IS_MOCK__: boolean }).__IS_MOCK__) {
      this.logger.debug?.(`PrismaService is mocked`);
    }
  }

  enter<T extends TransactionResult>(
    fn: (transaction: PrismaTransaction) => Promise<T>,
  ): Promise<T> {
    return this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        return TransactionService.transactionStorage.run(
          transaction,
          async () => {
            this.logger.debug?.(`Entering a transaction`);

            const result = await fn(transaction);

            if (!result.ok) {
              // leaving logging of the error to itself to request logger middleware to avoid double logging
              this.logger.debug?.(`Rolling back transaction due to error`);
              throw result.error;
            }

            this.logger.debug?.(`Transaction ended successfully`);

            return result;
          },
        );
      },
    );
  }

  current(): PrismaTransaction {
    const transaction = TransactionService.transactionStorage.getStore();
    if (!transaction) {
      this.logger.debug?.(`Using default Prisma instance`);
      return this.prismaService;
    } else {
      this.logger.debug?.(`Using current Prisma transaction from context`);
      return transaction;
    }
  }
}

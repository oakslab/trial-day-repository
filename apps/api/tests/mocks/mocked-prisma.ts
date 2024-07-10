import { PrismaService } from '../../src/lib/db/prisma';

export type PrismaMock = Omit<PrismaService, '$disconnect' | '$on'>;

type PrismaTransaction = Omit<
  PrismaService,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$extends'
  | 'onModuleInit'
  | 'enableShutdownHooks'
>;

// //before Prisma is initialised, override DATABASE_URL with DATABASE_TESTS_URL if available
// process.env.DATABASE_URL =
//   process.env.DATABASE_TEST_URL ??
//   'postgresql://prisma-tests:password@127.0.0.1:5433/reusable_repo_tests';

const prismaService = new PrismaService();

/**
 * Test hook for providing and managing transaction isolated prisma instance for testing
 * Note: Is not a full prisma client, e.g. cannot connect, transactions are implemented via pg checkpoints
 * @see https://stackoverflow.com/a/70119786
 */

type PrismaTransactionOptions = Parameters<
  typeof prismaService.$transaction
>[1];

const EXPECTED_ROLLBACK_ERROR = 'EXPECTED_ROLLBACK_ERROR';

export const useMockedPrisma = (options?: PrismaTransactionOptions) => {
  let prismaTransaction: PrismaTransaction;
  let onTransactionFinished: () => void;

  beforeEach(async () => {
    await new Promise<void>((resolve) => {
      prismaService
        .$transaction((prismaTx) => {
          prismaTransaction = prismaTx;
          resolve(); // beforeEach can finish
          return new Promise((_, reject) => {
            // transaction callback will always reject (to rollback), but only after test done
            onTransactionFinished = () => reject(EXPECTED_ROLLBACK_ERROR);
          });
        }, options)
        // always reject to rollback, no handling
        .catch((e) => {
          if (e === EXPECTED_ROLLBACK_ERROR) return;
          throw e;
        });
    });
  });

  afterEach(() => {
    onTransactionFinished();
  });

  // To avoid working with extra getter, Proxy does lazy delegation of Prisma calls
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop == '$transaction') {
          return async (
            cb: (prismaTx: PrismaTransaction) => Promise<PrismaMock>,
          ) => {
            if (typeof cb == 'object') {
              throw new Error(
                'Array syntax unsupported by the mocked Prisma, use the callback overload instead.',
              );
            }
            await prismaTransaction.$queryRaw`SAVEPOINT a;`.catch(() => {});
            return cb(prismaTransaction).catch(async (err) => {
              await prismaTransaction.$queryRaw`ROLLBACK TO SAVEPOINT a;`.catch(
                () => {},
              );
              console.error('err', err);
              throw err;
            });
          };
        } else if (prop == '$use') {
          return prismaService.$use;
        } else if (prop == '$connect') {
          return prismaService.$connect;
        } else if (prop === '__IS_MOCK__') {
          return true;
        }

        return prismaTransaction[prop as keyof PrismaTransaction];
      },
    },
  ) as PrismaMock;
};

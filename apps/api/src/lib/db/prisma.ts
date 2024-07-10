import { PrismaClient, Prisma, prisma } from 'database';
import { Service } from 'typedi';
import { runInChildSpan } from '../tracer';

const extension = Prisma.defineExtension({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const traceName = `prisma.${model}.${operation}`;
        return runInChildSpan({ name: traceName, operation }, () => {
          return query(args);
        });
      },
    },
  },
});

@Service({
  global: true,
  factory: () => prisma.$extends(extension),
})
export class PrismaService extends PrismaClient {}

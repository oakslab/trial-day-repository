import { PostListInputType } from 'common';
import { Prisma } from 'database';
import { Service } from 'typedi';

import { SortDirectionEnum } from '@base/common-base';

import { TransactionService } from '../../lib/db/transactionService';

@Service()
export class PostRepository {
  constructor(readonly transactionService: TransactionService) {}

  findMany<
    T extends Prisma.PostFindManyArgs,
    Result extends Array<Prisma.PostGetPayload<T>>,
  >(args?: T) {
    return this.transactionService
      .current()
      .post.findMany(args) as Promise<Result>;
  }

  findFirst<
    T extends Prisma.PostFindFirstArgs,
    Result extends Prisma.PostGetPayload<T> | null,
  >(args?: T) {
    return this.transactionService
      .current()
      .post.findFirst(args) as unknown as Promise<Result>;
  }

  findUnique<
    T extends Prisma.PostFindUniqueArgs,
    Result extends Prisma.PostGetPayload<T> | null,
  >(args: T) {
    return this.transactionService
      .current()
      .post.findUnique(args) as unknown as Promise<Result>;
  }

  count<T extends Prisma.PostCountArgs>(args?: T): Promise<number> {
    return this.transactionService.current().post.count(args);
  }

  update<
    T extends Prisma.PostUpdateArgs,
    Result extends Prisma.PostGetPayload<T>,
  >(args: T) {
    return this.transactionService
      .current()
      .post.update(args) as unknown as Promise<Result>;
  }

  create<
    T extends Prisma.PostCreateArgs,
    Result extends Prisma.PostGetPayload<T>,
  >(args: T) {
    return this.transactionService
      .current()
      .post.create(args) as unknown as Promise<Result>;
  }

  delete<
    T extends Prisma.PostDeleteArgs,
    Result extends Prisma.PostGetPayload<T>,
  >(args: T) {
    return this.transactionService
      .current()
      .post.delete(args) as unknown as Promise<Result>;
  }

  async findManyAsPagedList(args: Prisma.PostFindManyArgs) {
    const [count, items] = await Promise.all([
      this.transactionService.current().post.count({ where: args.where }),
      this.transactionService.current().post.findMany(args),
    ]);

    return {
      count,
      items,
    };
  }

  async search({ page, pageSize, orderBy }: PostListInputType) {
    const defaultOrderBy = { id: SortDirectionEnum.asc } as const;
    orderBy = orderBy ? { ...defaultOrderBy, ...orderBy } : defaultOrderBy;

    return this.findManyAsPagedList({
      take: pageSize,
      skip: page * pageSize,
      orderBy,
    });
  }
}

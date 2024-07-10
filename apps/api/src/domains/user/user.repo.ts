import { SortDirectionEnum, UserListInputType } from '@base/common-base';
import { UserStatusToCount } from '@base/common-base/src/domain/user/user.types';
import { Prisma } from 'database';
import { Service } from 'typedi';
import { TransactionService } from '../../lib/db/transactionService';

@Service()
export class UserRepository {
  constructor(readonly transactionService: TransactionService) {}

  findMany<
    T extends Prisma.UserFindManyArgs,
    Result extends Array<Prisma.UserGetPayload<T>>,
  >(args?: T) {
    return this.transactionService
      .current()
      .user.findMany(args) as Promise<Result>;
  }

  findFirst<
    T extends Prisma.UserFindFirstArgs,
    Result extends Prisma.UserGetPayload<T> | null,
  >(args?: T) {
    return this.transactionService
      .current()
      .user.findFirst(args) as Promise<Result>;
  }

  findUnique<
    T extends Prisma.UserFindUniqueArgs,
    Result extends Prisma.UserGetPayload<T> | null,
  >(args: T) {
    return this.transactionService
      .current()
      .user.findUnique(args) as Promise<Result>;
  }

  count<T extends Prisma.UserCountArgs>(args?: T): Promise<number> {
    return this.transactionService.current().user.count(args);
  }

  update<
    T extends Prisma.UserUpdateArgs,
    Result extends Prisma.UserGetPayload<T>,
  >(args: T) {
    return this.transactionService
      .current()
      .user.update(args) as Promise<Result>;
  }

  create<
    T extends Prisma.UserCreateArgs,
    Result extends Prisma.UserGetPayload<T>,
  >(args: T) {
    return this.transactionService
      .current()
      .user.create(args) as Promise<Result>;
  }

  delete<
    T extends Prisma.UserDeleteArgs,
    Result extends Prisma.UserGetPayload<T>,
  >(args: T) {
    return this.transactionService
      .current()
      .user.delete(args) as Promise<Result>;
  }

  async countUsersByStatus() {
    const result = await this.transactionService.current().user.groupBy({
      by: ['status'],
      _count: true,
    });

    return result.reduce(
      (obj, res) => ({ ...obj, [res.status]: res._count }),
      {} as UserStatusToCount,
    );
  }

  async findManyAsPagedList(args: Prisma.UserFindManyArgs) {
    const [count, items] = await Promise.all([
      this.transactionService.current().user.count({ where: args.where }),
      this.transactionService.current().user.findMany(args),
    ]);

    return {
      count,
      items,
    };
  }

  async searchUsers({ filters, page, pageSize, orderBy }: UserListInputType) {
    const defaulOrderBy = { lastName: SortDirectionEnum.asc } as const;
    orderBy = orderBy ?? defaulOrderBy;

    if (!filters) {
      return this.findManyAsPagedList({
        take: pageSize,
        skip: page * pageSize,
        orderBy,
      });
    }

    const { searchTerm, status, role, createdBetween } = filters;
    const where: Prisma.UserWhereInput = {
      ...(searchTerm && {
        OR: [
          {
            firstName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      }),
      ...(role &&
        role.length > 0 && {
          role: {
            in: role,
          },
        }),
      ...(status && {
        status: {
          equals: status,
        },
      }),
      createdAt: {
        gte: createdBetween?.start || undefined,
        lte: createdBetween?.end || undefined,
      },
    };

    return this.findManyAsPagedList({
      where,
      take: pageSize,
      skip: page * pageSize,
      orderBy: [orderBy, { id: SortDirectionEnum.asc }],
    });
  }
}

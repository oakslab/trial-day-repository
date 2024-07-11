import { validateNodeEnvTesting } from '@base/common-base';
import { Post } from 'database';
import times from 'lodash/times';
import { PrismaMock } from '../../../tests/mocks/mocked-prisma';

export class PostFixtures {
  constructor(private readonly prisma: PrismaMock) {}

  static of(partialData?: Partial<Post>): Omit<Post, 'id'> {
    validateNodeEnvTesting();
    return {
      ...partialData,
    };
  }

  async createMany(count: number, data?: Partial<Post>) {
    validateNodeEnvTesting();

    const dataCreated = times(count, () => PostFixtures.of(data));

    return this.prisma.post.createManyAndReturn({
      data: dataCreated,
    });
  }

  async create(data?: Partial<Post>) {
    validateNodeEnvTesting();

    const dataCreated = PostFixtures.of(data);

    return this.prisma.post.create({
      data: dataCreated,
    });
  }
}

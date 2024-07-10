import crypto from 'node:crypto';
import {
  injectClaimsToInvitationKey,
  validateNodeEnvTesting,
} from '@base/common-base';
import { faker } from '@faker-js/faker';
import { User, UserRole, UserStatus } from 'database';
import { UniqueEnforcer } from 'enforce-unique';
import sample from 'lodash/sample';
import times from 'lodash/times';
import { nanoid } from 'nanoid';
import { PrismaMock } from '../../../tests/mocks/mocked-prisma';

// ensure unique emails (https://next.fakerjs.dev/guide/unique#unique-values)
const uniqueEnforcerEmail = new UniqueEnforcer();

// TODO genralise partial to AbstractFixtures after first code-review
export class UserFixtures {
  constructor(private readonly prisma: PrismaMock) {}

  static of(userData?: Partial<User>): Omit<User, 'id'> {
    validateNodeEnvTesting();
    const uid = nanoid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = uniqueEnforcerEmail
      .enforce(() =>
        faker.internet.email({
          firstName,
          lastName,
        }),
      )
      .toLowerCase();

    const invitationKey = injectClaimsToInvitationKey(
      crypto.randomBytes(16).toString('hex'),
      {
        email,
        expiresInDays: 1000,
      },
    );

    const userStatus = userData?.status || (sample(UserStatus) as UserStatus);
    const isPending = userStatus === UserStatus.PENDING;

    return {
      uid: isPending ? null : uid,
      firstName: isPending ? null : firstName,
      lastName: isPending ? null : lastName,
      email,
      avatarId: null,
      createdAt: new Date(),
      disabledAt: null,
      invitationKey: isPending ? invitationKey : null,
      role: sample(UserRole) as UserRole,
      status: userStatus,
      ...userData,
    };
  }

  async createMany(count: number, data?: Partial<User>) {
    validateNodeEnvTesting();

    const users = times(count, () => UserFixtures.of(data));

    return this.prisma.user.createManyAndReturn({
      data: users,
    });
  }

  async create(data?: Partial<User>) {
    validateNodeEnvTesting();

    const user = UserFixtures.of(data);

    return this.prisma.user.create({
      data: user,
    });
  }
}

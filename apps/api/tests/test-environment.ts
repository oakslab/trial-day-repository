import 'reflect-metadata';

// eslint-disable-next-line import/order
import { apiEnv } from '../src/lib/env';
apiEnv.EMAIL_PROVIDER = 'test';
apiEnv.ENVIRONMENT = 'test';
apiEnv.FROM_EMAIL_ADDRESS = 'test@oakslab.com';

import { Permissions, hasPermissionForRoleMapping } from '@base/common-base';
import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { createCallerFactory } from '@trpc/server';
import { permissionRoleMapping } from 'common';
import { User, UserRole } from 'database';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';
import Container, { ContainerInstance } from 'typedi';
import { AppRouter, appRouter } from '../src/app';
import { UserFixtures } from '../src/domains/user/user.fixtures';
import { PrismaService } from '../src/lib/db/prisma';
import { AuthService, AuthServiceMock } from '../src/services/auth';
import { RequestContext } from '../src/trpc/types';
import { PrismaMock, useMockedPrisma } from './mocks/mocked-prisma';

const callerFactory = createCallerFactory();

type TestContextFactory = ({ user }: { user?: User | null }) => RequestContext;
export type TestUsers = Record<UserRole, User>;

export const useTestEnvironment = (): {
  createTestCaller: ReturnType<typeof callerFactory<AppRouter>>;
  createTestContext: TestContextFactory;
  prisma: PrismaMock;
  testUsers: TestUsers;
  getTestUserByPermission: (permissions: Permissions) => User;
  container: ContainerInstance;
} => {
  //seed faker with constant to ensure consistent test data and reproducibility
  faker.seed(123);

  const prismaMock = useMockedPrisma();
  const testUsers: TestUsers = {} as TestUsers;
  const requestContainer = Container.of(nanoid());
  const mockPrismaForContainers = () => {
    //mocked prisma service needs to be set on both the global container and the request container
    Container.set(PrismaService, prismaMock);
    requestContainer.set(PrismaService, prismaMock);

    Container.set(AuthService, new AuthServiceMock());
    requestContainer.set(AuthService, new AuthServiceMock());
  };

  mockPrismaForContainers();

  beforeEach(async () => {
    Container.reset();
    mockPrismaForContainers();

    //create default fixture user for each user role in the database
    const userRoles = Object.values(UserRole);
    const userFixtures = new UserFixtures(prismaMock);
    await Promise.all(
      userRoles.map(async (role) => {
        testUsers[role] = await userFixtures.create({ role });
      }),
    );
  });

  const getTestUserByPermission = (permissions: Permissions): User => {
    const hasPermission = hasPermissionForRoleMapping(permissionRoleMapping);

    const userRoles = Object.values(UserRole);
    for (const role of userRoles) {
      if (permissions.every((permission) => hasPermission(role, permission))) {
        return testUsers[role];
      }
    }

    throw new Error(
      `No user found with the given permissions: ${permissions.join(', ')}`,
    );
  };

  const createTestContext: TestContextFactory = ({ user }) => {
    const req = createMock<NextApiRequest>();
    req.rawHeaders = [];
    return {
      container: requestContainer,
      user: user ?? null,
      req,
      res: createMock<NextApiResponse>(),
    };
  };
  const createTestCaller = callerFactory(appRouter);

  return {
    prisma: prismaMock,
    createTestContext,
    createTestCaller,
    getTestUserByPermission,
    testUsers: testUsers,
    container: requestContainer,
  };
};

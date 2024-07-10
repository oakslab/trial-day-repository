import { UserListOutputType } from '@base/common-base';
import { useTestEnvironment } from '../../../tests/test-environment';
import { UserListEndpoint } from './user-list.endpoint';
import { UserFixtures } from './user.fixtures';

describe(UserListEndpoint.name, () => {
  const { createTestCaller, createTestContext, prisma, testUsers } =
    useTestEnvironment();

  const userFixtures = new UserFixtures(prisma);

  it('should fetch all pages list and validate all users are returned', async () => {
    //arrange
    const pageSize = 10;
    await userFixtures.createMany(pageSize * 2 + 5);
    const ctx = createTestContext({ user: testUsers.ADMIN });
    const testCaller = createTestCaller(ctx);

    let page = 0;
    let allUsers: UserListOutputType['items'] = [];
    let fetchedUsers: UserListOutputType['items'];

    //act
    do {
      const result = await testCaller.user.list({
        filters: {},
        pageSize,
        page,
      });

      expect(allUsers).not.toEqual(null);

      fetchedUsers = result.data?.items ?? [];
      allUsers = allUsers.concat(result.data?.items ?? []);
      page++;
    } while (fetchedUsers.length === pageSize);

    //assert
    const expectedUsers = await prisma.user.findMany({});

    expect(allUsers).toHaveLength(expectedUsers.length);

    expectedUsers.forEach((user) => {
      expect(allUsers).toContainEqual(
        expect.objectContaining({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      );
    });
  });

  it('should fail for non-admin user', async () => {
    //arrange
    const ctx = createTestContext({ user: testUsers.USER });
    const testCaller = createTestCaller(ctx);

    //act
    //assert
    await expect(testCaller.user.list({ filters: {} })).rejects.toThrow(
      'FORBIDDEN',
    );
  });

  it('should fail for non-authenticated user', async () => {
    //arrange
    const ctx = createTestContext({});
    const testCaller = createTestCaller(ctx);

    //act
    //assert
    await expect(testCaller.user.list({ filters: {} })).rejects.toThrow(
      'UNAUTHORIZED',
    );
  });

  it.todo('should filter by search term and role');
  it.todo('should filter by status');
  it.todo('should order by input parameters');
});

import { faker } from '@faker-js/faker';
import { UserRole, UserStatus } from 'database';
import omit from 'lodash/omit';
import { useTestEnvironment } from '../../../tests/test-environment';
import { UserUpdateEndpoint } from './user-update.endpoint';
import { UserFixtures } from './user.fixtures';

describe(UserUpdateEndpoint.name, () => {
  const { createTestCaller, createTestContext, prisma, testUsers } =
    useTestEnvironment();
  const userFixtures = new UserFixtures(prisma);

  it('should update all attributes from input data', async () => {
    //arrange
    const userToUpdate = await userFixtures.create({
      role: faker.helpers.enumValue(UserRole),
      status: UserStatus.ACTIVE,
    });
    const updateData = omit(
      UserFixtures.of({
        uid: userToUpdate.uid,
        createdAt: userToUpdate.createdAt,
      }),
      'invitationKey',
    );

    const ctx = createTestContext({ user: testUsers.ADMIN });
    const testCaller = createTestCaller(ctx);

    //act
    const updatedUser = await testCaller.user.update({
      ...userToUpdate,
      ...updateData,
    });

    //assert
    expect(updatedUser.result).toEqual('success');
    expect(
      updatedUser.result === 'success' &&
        omit(updatedUser.data, 'invitationKey'),
    ).toEqual({
      id: userToUpdate.id,
      ...updateData,
    });
  });

  it('should fail for non-admin user', async () => {
    //arrange
    const userToUpdate = await userFixtures.create({
      role: faker.helpers.enumValue(UserRole),
      status: UserStatus.ACTIVE,
    });
    const updateData = userToUpdate;

    const ctx = createTestContext({ user: testUsers.USER });
    const testCaller = createTestCaller(ctx);

    //act
    //assert
    await expect(
      testCaller.user.update({
        ...userToUpdate,
        ...updateData,
      }),
    ).rejects.toThrow('FORBIDDEN');
  });
});

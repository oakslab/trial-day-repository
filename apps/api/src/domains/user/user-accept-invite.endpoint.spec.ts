import { injectClaimsToInvitationKey } from '@base/common-base';
import { faker } from '@faker-js/faker';
import { UserRole, UserStatus } from 'database';
import { useTestEnvironment } from '../../../tests/test-environment';
import { UserAcceptInviteEndpoint } from './user-accept-invite.endpoint';
import { UserErrors } from './user.errors';
import { UserFixtures } from './user.fixtures';

const password = 'Securepassword12$';

describe(UserAcceptInviteEndpoint.name, () => {
  const { createTestCaller, createTestContext, testUsers, prisma } =
    useTestEnvironment();

  const userFixtures = new UserFixtures(prisma);

  it('should successfully accept an invite', async () => {
    //arrange
    const email = 'testacceptinvite@oakslab.com';
    const invitationKey = injectClaimsToInvitationKey('valid-key', {
      email,
      expiresInDays: 10,
    });

    const createdUser = await userFixtures.create({
      email,
      role: faker.helpers.enumValue(UserRole),
      status: 'PENDING',
      invitationKey,
    });

    const input = {
      invitationKey,
      firstName: 'John',
      lastName: 'Doe',
      password,
    };

    const ctx = createTestContext({});
    const testCaller = createTestCaller(ctx);

    //act
    const result = await testCaller.user.acceptInvite(input);

    //assert
    expect(result.result).toBe('success');

    if (result.result === 'success') {
      expect(result.data).toEqual({
        ...createdUser,
        uid: expect.any(String),
        firstName: input.firstName,
        lastName: input.lastName,
        status: UserStatus.ACTIVE,
        invitationKey: null,
      });
    }
  });

  it('should return an error result if the invitation key is invalid', async () => {
    const input = {
      invitationKey: 'invalid-key',
      firstName: 'John',
      lastName: 'Doe',
      password,
    };

    const ctx = createTestContext({ user: testUsers.USER });
    const testCaller = createTestCaller(ctx);

    const result = await testCaller.user.acceptInvite(input);
    expect(result.result).toBe('error');
    if (result.result === 'error') {
      expect(result.error).toBe(UserErrors.INVITATION_KEY_CORRUPTED);
    }
  });

  // rest of the scenarios are tested in `user-invitation.service.spec.ts`
});

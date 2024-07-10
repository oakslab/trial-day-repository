import { faker } from '@faker-js/faker';
import { TRPCError } from '@trpc/server';
import { UserRole } from 'database';
import { useTestEnvironment } from '../../../tests/test-environment';
import { TestEmailProvider } from '../../services/email/providers/test-email.provider';
import { UserInviteEndpoint } from './user-invite.endpoint';
import { UserErrors } from './user.errors';

const email = 'test@oakslab.com';

describe(UserInviteEndpoint.name, () => {
  const {
    createTestCaller,
    createTestContext,
    testUsers,
    getTestUserByPermission,
  } = useTestEnvironment();

  beforeEach(() => {
    TestEmailProvider.clearEmailLog();
    TestEmailProvider.resetMockResult();
  });

  it('should successfully invite a user', async () => {
    const input = {
      email,
      role: faker.helpers.enumValue(UserRole),
    };

    const ctx = createTestContext({
      user: getTestUserByPermission(['user.invite']),
    });
    const testCaller = createTestCaller(ctx);

    const result = await testCaller.user.invite(input);

    expect(result.result).toBe('success');

    expect(TestEmailProvider.emailLog).toHaveLength(1);
  });

  it('should return an error result if the email already exists', async () => {
    const input = {
      email: testUsers.USER.email,
      role: faker.helpers.enumValue(UserRole),
    };

    const ctx = createTestContext({
      user: getTestUserByPermission(['user.invite']),
    });
    const testCaller = createTestCaller(ctx);

    const result = await testCaller.user.invite(input);

    expect(result.result).toBe('error');

    expect(TestEmailProvider.emailLog).toHaveLength(0);

    if (result.result === 'error') {
      expect(result.error.code).toBe(UserErrors.EMAIL_EXISTS.code);
    }
  });

  it('should handle email provider error', async () => {
    const input = {
      email,
      role: faker.helpers.enumValue(UserRole),
    };

    // Set the mock result to simulate a failure in sending email
    TestEmailProvider.mockResult = {
      success: false,
      failed: [email],
      meta: { myErrorMeta: 'error meta' },
    };

    const ctx = createTestContext({
      user: getTestUserByPermission(['user.invite']),
    });
    const testCaller = createTestCaller(ctx);

    try {
      await testCaller.user.invite(input);
      expect('not to be here').toBe('should not get here, should throw error');
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      if (error instanceof TRPCError) {
        expect(error.code).toBe('INTERNAL_SERVER_ERROR');
        expect(error.message).toContain(email);
        expect(error.message).toContain(
          JSON.stringify(TestEmailProvider.mockResult, null, 2),
        );
      }
    }
  });
});

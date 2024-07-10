import { injectClaimsToInvitationKey } from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { useTestEnvironment } from '../../../tests/test-environment';
import { LoggerService } from '../../services';
import { UserInvitationService } from './user-invitation.service';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

const bareInvitationKey = 'testingkey';
const email = 'test@oakslab.com';

const validInvitationKey = injectClaimsToInvitationKey(bareInvitationKey, {
  expiresInDays: 15,
  email,
});

describe(UserInvitationService.name, () => {
  const { container } = useTestEnvironment();

  const userRepo = container.get(UserRepository);
  const logger = container.get(LoggerService);
  const service = new UserInvitationService(userRepo, logger);

  describe(
    UserInvitationService.prototype.validateAndParseInvitationKey.name,
    () => {
      it('should return error INVITATION_KEY_EXPIRED if invitation key expiresAt goes to past', async () => {
        const invitationKey = injectClaimsToInvitationKey(bareInvitationKey, {
          expiresInDays: -2,
          email,
        });

        const result =
          await service.validateAndParseInvitationKey(invitationKey);

        expect(result.result).toBe('error');
        if (result.result === 'error') {
          expect(result.error.code).toBe(
            UserErrors.INVITATION_KEY_EXPIRED.code,
          );

          if (result.error.code === UserErrors.INVITATION_KEY_EXPIRED.code) {
            expect(result.error.subcode).toBe(
              UserErrors.INVITATION_KEY_EXPIRED.subcode,
            );
          }
        }
      });

      it('should return INVITATION_ALREADY_ACCEPTED error if the user already has firebase uid set up', async () => {
        await userRepo.create({
          data: {
            email,
            invitationKey: validInvitationKey,
            uid: 'testuid',
          },
        });

        const result =
          await service.validateAndParseInvitationKey(validInvitationKey);

        expect(result.result).toBe('error');
        if (result.result === 'error') {
          expect(result.error.code).toBe(
            UserErrors.INVITATION_ALREADY_ACCEPTED.code,
          );

          if (
            result.error.code === UserErrors.INVITATION_ALREADY_ACCEPTED.code
          ) {
            expect(result.error.subcode).toBe(
              UserErrors.INVITATION_ALREADY_ACCEPTED.subcode,
            );
          }
        }
      });

      it('should return error INVITATION_KEY_CORRUPTED if invitation key is corrupted', async () => {
        const corruptedInvitationKey = 'corruptedkey';

        const result = await service.validateAndParseInvitationKey(
          corruptedInvitationKey,
        );

        expect(result.result).toBe('error');
        if (result.result === 'error') {
          expect(result.error.code).toBe(
            UserErrors.INVITATION_KEY_CORRUPTED.code,
          );

          if (result.error.code === UserErrors.INVITATION_KEY_CORRUPTED.code) {
            expect(result.error.subcode).toBe(
              UserErrors.INVITATION_KEY_CORRUPTED.subcode,
            );
          }
        }
      });

      it('should return error USER_NOT_FOUND if user by email is not found', async () => {
        const nonExistentEmailKey = injectClaimsToInvitationKey(
          bareInvitationKey,
          {
            expiresInDays: 15,
            email: 'nonexistent@oakslab.com',
          },
        );

        const result =
          await service.validateAndParseInvitationKey(nonExistentEmailKey);

        expect(result.result).toBe('error');
        if (result.result === 'error')
          expect(result.error.code).toBe(UserErrors.USER_NOT_FOUND.code);
      });

      it('should return success with user details if invitation key is valid', async () => {
        await userRepo.create({
          data: {
            email,
            invitationKey: validInvitationKey,
          },
        });

        const result =
          await service.validateAndParseInvitationKey(validInvitationKey);

        expect(result.result).toBe('success');
        if (result.result === 'success') {
          expect(result.data.valid).toBe(true);
          expect(result.data.user.email).toBe(email);
        }
      });

      it('should throw UNPROCESSABLE_CONTENT error if invitation key is invalid', async () => {
        jest.spyOn(logger, 'error').mockImplementation(() => {});

        const invalidInvitationKey = injectClaimsToInvitationKey(
          bareInvitationKey,
          {
            expiresInDays: 15,
            email,
          },
        );

        await userRepo.create({
          data: {
            email,
            invitationKey: 'anotherkey',
          },
        });

        try {
          await service.validateAndParseInvitationKey(invalidInvitationKey);
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          if (error instanceof TRPCError) {
            expect(error.code).toBe('UNPROCESSABLE_CONTENT');
            expect(error.message).toBe('Invitation key is invalid');
          }
        }
      });
    },
  );
});

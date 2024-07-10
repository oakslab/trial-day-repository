import crypto from 'node:crypto';
import {
  Result,
  extractClaimsFromInvitationKey,
  injectClaimsToInvitationKey,
} from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { Service } from 'typedi';
import { apiEnv } from '../../lib/env';
import { LoggerService } from '../../services';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserInvitationService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  generateInvitationKey(
    email: string,
    expiresInDays: number = apiEnv.INVITATION_KEY_EXPIRES_IN_DAYS,
  ) {
    // 2^128 possible values (340,282,366,920,938,463,463,374,607,431,768,211,456)
    const bareInvitationKey = crypto.randomBytes(16).toString('hex');
    return injectClaimsToInvitationKey(bareInvitationKey, {
      email,
      expiresInDays,
    });
  }

  async validateAndParseInvitationKey(invitationKey: string) {
    const userByInvitationKey = await this.userRepo.findUnique({
      where: {
        invitationKey,
      },
    });

    if (userByInvitationKey?.uid) {
      return Result.error(UserErrors.INVITATION_ALREADY_ACCEPTED);
    }

    if (userByInvitationKey) {
      return Result.success({
        valid: true,
        user: userByInvitationKey,
      });
    }

    let claims;

    //
    try {
      claims = extractClaimsFromInvitationKey(invitationKey);
    } catch (e) {
      return Result.error(UserErrors.INVITATION_KEY_CORRUPTED);
    }

    const { email, expiresAt } = claims;

    if (expiresAt < new Date()) {
      return Result.error(UserErrors.INVITATION_KEY_EXPIRED);
    }

    const userByEmail = await this.userRepo.findUnique({
      where: {
        email,
      },
    });

    if (!userByEmail) {
      // User might have been deleted in the meantime
      return Result.error(UserErrors.USER_NOT_FOUND);
    }

    if (userByEmail.uid) {
      return Result.error(UserErrors.INVITATION_ALREADY_ACCEPTED);
    }

    this.logger.error('Invitation key is invalid', {
      email,
      invitationKey: invitationKey,
    });

    throw new TRPCError({
      code: 'UNPROCESSABLE_CONTENT',
      message: 'Invitation key is invalid',
    });
  }
}

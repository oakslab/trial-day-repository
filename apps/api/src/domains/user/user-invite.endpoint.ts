import {
  Result,
  UserInviteInputType,
  generateAcceptInvitationUrl,
} from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { userRolePortalMapping } from 'common';
import { UserStatus } from 'database';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { apiEnv } from '../../lib/env';
import { LoggerService } from '../../services';
import { EmailsRegistry } from '../../services/email/emails.registry';
import {
  catchAndThrowIfNotExpected,
  uniqueKeyViolation,
} from '../../utils/prismaKnownErrors';
import { UserInvitationService } from './user-invitation.service';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserInviteEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userInvitationService: UserInvitationService,
    private readonly emailsRegistry: EmailsRegistry,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserInviteInputType>) {
    let user;
    try {
      const invitationKey = this.userInvitationService.generateInvitationKey(
        input.email,
      );

      user = await this.userRepo.create({
        data: {
          ...input,
          status: UserStatus.PENDING,
          invitationKey,
        },
      });

      const result = await this.emailsRegistry.sendInviteUserEmail({
        to: [user.email],
        acceptInviteUrl: generateAcceptInvitationUrl(
          apiEnv[userRolePortalMapping[input.role]],
          invitationKey,
        ),
      });

      if (!result.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to send invitation email to ${user.email}. ${JSON.stringify(result, null, 2)}`,
        });
      }
    } catch (e) {
      return catchAndThrowIfNotExpected(
        uniqueKeyViolation(Result.error(UserErrors.EMAIL_EXISTS)),
      )(e);
    }

    this.logger.info('User invited', {
      id: user.id,
      data: user,
    });

    return Result.success(user);
  }
}

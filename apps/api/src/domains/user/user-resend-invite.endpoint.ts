import {
  Result,
  UserResendInviteInputType,
  generateAcceptInvitationUrl,
} from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { UserStatus } from 'database';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { AuthService } from '../../services/auth';
import { EmailsRegistry } from '../../services/email/emails.registry';
import { getPortalUrlBasedOnRole } from '../../utils/helpers';
import { UserInvitationService } from './user-invitation.service';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserResendInviteEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userInvitationService: UserInvitationService,
    private readonly authService: AuthService,
    private readonly emailsRegistry: EmailsRegistry,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserResendInviteInputType>) {
    const user = await this.userRepo.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!user) {
      return Result.error(UserErrors.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.ACTIVE) {
      return Result.error(UserErrors.USER_IS_ACTIVE_ALREADY);
    }

    if (user.status === UserStatus.BANNED) {
      return Result.error(UserErrors.USER_IS_BANNED);
    }

    const invitationKey = this.userInvitationService.generateInvitationKey(
      user.email,
    );

    if (user.uid) {
      await this.authService.deleteFirebaseUser(user.uid);
    }

    await this.userRepo.update({
      where: {
        id: user.id,
      },
      data: {
        invitationKey,
        uid: null,
      },
    });

    const result = await this.emailsRegistry.sendInviteUserEmail({
      to: [user.email],
      acceptInviteUrl: generateAcceptInvitationUrl(
        getPortalUrlBasedOnRole(user.role),
        invitationKey,
      ),
    });

    if (!result.success) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to send invitation email to ${user.email}. ${JSON.stringify(result, null, 2)}`,
      });
    }

    this.logger.info('User invitation email resent', {
      id: user.id,
      data: user,
    });

    return Result.success(user);
  }
}

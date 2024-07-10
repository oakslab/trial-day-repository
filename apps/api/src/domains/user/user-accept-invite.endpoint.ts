import { Result, UserAcceptInviteInputType } from '@base/common-base';
import { UserStatus } from 'database';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { AuthService } from '../../services/auth';
import { UserInvitationService } from './user-invitation.service';
import { UserRepository } from './user.repo';

@Service()
export class UserAcceptInviteEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userInvitationService: UserInvitationService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserAcceptInviteInputType>) {
    const validateResult =
      await this.userInvitationService.validateAndParseInvitationKey(
        input.invitationKey,
      );

    if (validateResult.result === 'error') {
      return validateResult;
    }

    const user = validateResult.data.user;

    const firebaseUser = await this.authService.createFirebaseUser({
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: input.password,
      // email is already verified since the invitation was received via email
      emailVerified: true,
    });

    const updatedUser = await this.userRepo.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        uid: firebaseUser.uid,
        invitationKey: null,
        status: UserStatus.ACTIVE,
      },
    });

    this.logger.info('User accepted invite', {
      id: user.id,
      data: updatedUser,
    });

    return Result.success(updatedUser);
  }
}

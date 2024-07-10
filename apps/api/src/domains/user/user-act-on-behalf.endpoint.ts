import { Result, UserActOnBehalfInputType } from '@base/common-base';
import { userRolePortalMapping } from 'common';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { apiEnv } from '../../lib/env';
import { LoggerService } from '../../services';
import { AuthService } from '../../services/auth';
import { ProtectedContext } from '../../trpc/types';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserActOnBehalfEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({
    input,
    ctx,
  }: EndpointParam<UserActOnBehalfInputType, ProtectedContext>) {
    const user = await this.userRepo.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!user) {
      return Result.error(UserErrors.USER_NOT_FOUND);
    }

    if (!user.uid) {
      return Result.error(UserErrors.USER_DID_NOT_ACCEPT_INVITE_YET);
    }

    const token = await this.authService.createCustomToken(user.uid, {
      id: user.id,
      role: user.role,
      original_user_id: ctx.user.id,
    });

    this.logger.info('User asked to act on behalf of', {
      user,
      original_user_id: ctx.user.id,
    });

    return Result.success({
      user,
      token,
      url: `${apiEnv[userRolePortalMapping[user.role]]}/auth/act-as?token=${encodeURIComponent(token)}`,
    });
  }
}

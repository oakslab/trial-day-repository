import { Result, UserEnableInputType } from '@base/common-base';
import { UserStatus } from 'database';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { AuthService } from '../../services/auth';
import {
  catchAndThrowIfNotExpected,
  notFound,
} from '../../utils/prismaKnownErrors';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserEnableEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserEnableInputType>) {
    try {
      const user = await this.userRepo.update({
        where: {
          id: input.id,
        },
        data: {
          status: UserStatus.ACTIVE,
          disabledAt: null,
        },
      });

      if (user?.uid) {
        await this.authService.auth.updateUser(user.uid, { disabled: true });
      }

      this.logger.info('User disabled', {
        id: input.id,
        data: user,
      });

      return Result.success(user);
    } catch (e) {
      return catchAndThrowIfNotExpected(
        notFound(Result.error(UserErrors.USER_NOT_FOUND)),
      )(e);
    }
  }
}

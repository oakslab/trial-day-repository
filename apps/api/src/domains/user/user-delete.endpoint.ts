import { Result, UserDeleteInputType } from '@base/common-base';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { AuthService } from '../../services/auth';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserDeleteEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserDeleteInputType>) {
    const dbUser = await this.userRepo.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!dbUser) {
      this.logger.error('User not found', {
        id: input.id,
      });

      return Result.error(UserErrors.USER_NOT_FOUND);
    }

    const deletedUser = await this.userRepo.delete({
      where: input,
    });

    if (dbUser.uid) {
      try {
        await this.authService.deleteFirebaseUser(dbUser.uid);
      } catch (error) {
        this.logger.error('Error deleting user from Firebase', {
          id: input.id,
          error,
        });

        return Result.error(UserErrors.USER_ALREADY_DELETED_FROM_FIREBASE);
      }
    }

    this.logger.info('User deleted', {
      id: input.id,
      data: deletedUser,
    });

    return Result.success(deletedUser);
  }
}

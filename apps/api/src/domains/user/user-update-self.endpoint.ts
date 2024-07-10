import { Result, UserUpdateSelfInputType } from '@base/common-base';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { ProtectedContext } from '../../trpc/types';
import {
  catchAndThrowIfNotExpected,
  uniqueKeyViolation,
  notFound,
} from '../../utils/prismaKnownErrors';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserUpdateSelfEndpoint extends BaseEndpoint {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepo: UserRepository,
  ) {
    super();
  }

  async execute({
    input,
    ctx: { user },
  }: EndpointParam<UserUpdateSelfInputType, ProtectedContext>) {
    let updatedUser;
    try {
      updatedUser = await this.userRepo.update({
        where: { id: user.id },
        data: input,
      });
    } catch (e) {
      return catchAndThrowIfNotExpected(
        notFound(Result.error(UserErrors.USER_NOT_FOUND)),
        uniqueKeyViolation(Result.error(UserErrors.EMAIL_EXISTS)),
      )(e);
    }

    this.logger.info('User updated themselves', {
      id: updatedUser.id,
      data: updatedUser,
    });

    return Result.success(updatedUser);
  }
}

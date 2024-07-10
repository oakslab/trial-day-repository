import { Result, UserUpdateInputType } from '@base/common-base';
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
export class UserUpdateEndpoint extends BaseEndpoint {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepo: UserRepository,
  ) {
    super();
  }

  async execute({
    input,
  }: EndpointParam<UserUpdateInputType, ProtectedContext>) {
    const { id, ...data } = input;

    let updatedUser;
    try {
      updatedUser = await this.userRepo.update({
        where: { id },
        data,
      });
    } catch (e) {
      return catchAndThrowIfNotExpected(
        notFound(Result.error(UserErrors.USER_NOT_FOUND)),
        uniqueKeyViolation(Result.error(UserErrors.EMAIL_EXISTS)),
      )(e);
    }

    this.logger.info('User updated', {
      id: updatedUser.id,
      data: updatedUser,
    });

    return Result.success(updatedUser);
  }
}

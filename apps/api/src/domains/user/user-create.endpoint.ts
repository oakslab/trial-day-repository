import { Result, UserCreateInputType } from '@base/common-base';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import {
  catchAndThrowIfNotExpected,
  uniqueKeyViolation,
} from '../../utils/prismaKnownErrors';
import { UserErrors } from './user.errors';
import { UserRepository } from './user.repo';

@Service()
export class UserCreateEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserCreateInputType>) {
    let user;
    try {
      user = await this.userRepo.create({
        data: input,
      });
    } catch (e) {
      return catchAndThrowIfNotExpected(
        uniqueKeyViolation(Result.error(UserErrors.EMAIL_EXISTS)),
      )(e);
    }

    this.logger.info('User created', {
      id: user.id,
      data: user,
    });

    return Result.success(user);
  }
}

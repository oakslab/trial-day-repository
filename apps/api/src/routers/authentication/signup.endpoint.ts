import { Result, SignupMutationInputType } from '@base/common-base';
import { UserRole } from 'database';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { UserRepository } from '../../lib/db';
import { LoggerService } from '../../services';
import {
  catchAndThrowIfNotExpected,
  uniqueKeyViolation,
} from '../../utils/prismaKnownErrors';
import { SignupErrors } from './signup.errors';

@Service()
export class SignupEndpoint extends BaseEndpoint {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly userRepo: UserRepository,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<SignupMutationInputType>) {
    try {
      await this.userRepo.create({
        data: {
          role: UserRole.USER,
          ...input,
        },
      });
    } catch (e) {
      return catchAndThrowIfNotExpected(
        uniqueKeyViolation(Result.error(SignupErrors.EMAIL_EXISTS)),
      )(e);
    }

    return Result.success({
      status: 'ok',
    });
  }
}

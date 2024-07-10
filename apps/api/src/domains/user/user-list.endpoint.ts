import { Result, UserListInputType } from '@base/common-base';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { UserRepository } from './user.repo';

@Service()
export class UserListEndpoint extends BaseEndpoint {
  constructor(private readonly userRepo: UserRepository) {
    super();
  }

  async execute({ input }: EndpointParam<UserListInputType>) {
    const { count, items } = await this.userRepo.searchUsers(input);

    return Result.success({
      count,
      items,
    });
  }
}

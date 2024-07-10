import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { Context } from '../../trpc/types';
import { UserRepository } from './user.repo';

@Service()
export class UserListCountByStatusEndpoint extends BaseEndpoint {
  constructor(private readonly userRepo: UserRepository) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_: EndpointParam<unknown, Context>) {
    return await this.userRepo.countUsersByStatus();
  }
}

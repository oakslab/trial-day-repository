import { Result } from '@base/common-base';
import { PostListInputType } from 'common';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { PostRepository } from './post.repo';

@Service()
export class PostListEndpoint extends BaseEndpoint {
  constructor(private readonly postRepo: PostRepository) {
    super();
  }

  async execute({ input }: EndpointParam<PostListInputType>) {
    const { count, items } = await this.postRepo.search(input);

    return Result.success({
      count,
      items,
    });
  }
}

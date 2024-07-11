import { Result } from '@base/common-base';
import { PostDeleteInputType } from 'common';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { PostRepository } from './post.repo';

@Service()
export class PostDeleteEndpoint extends BaseEndpoint {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<PostDeleteInputType>) {
    const post = await this.postRepo.delete({
      where: input,
    });

    this.logger.info('Post deleted', {
      id: input.id,
      data: post,
    });

    return Result.success(post);
  }
}

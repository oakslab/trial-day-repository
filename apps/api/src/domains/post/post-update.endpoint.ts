import { Result } from '@base/common-base';
import { PostUpdateInputType } from 'common';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { PostRepository } from './post.repo';

@Service()
export class PostUpdateEndpoint extends BaseEndpoint {
  constructor(
    private readonly logger: LoggerService,
    private readonly postRepo: PostRepository,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<PostUpdateInputType>) {
    const { id, ...data } = input;

    const updatedPost = await this.postRepo.update({
      where: { id },
      data,
    });

    this.logger.info('Post updated', {
      id: updatedPost.id,
      data: updatedPost,
    });

    return Result.success(updatedPost);
  }
}

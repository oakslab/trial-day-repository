import { PostCreateInputType } from 'common';
import { Service } from 'typedi';

import { Result } from '@base/common-base';

import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { PostRepository } from './post.repo';

@Service()
export class PostCreateEndpoint extends BaseEndpoint {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input, ctx }: EndpointParam<PostCreateInputType>) {
    const post = await this.postRepo.create({
      data: {
        ...input,
        author: { connect: { id: ctx.user!.id } },
        createdAt: new Date(),
      },
    });

    this.logger.info('Post created', {
      id: post.id,
      data: post,
    });

    return Result.success(post);
  }
}

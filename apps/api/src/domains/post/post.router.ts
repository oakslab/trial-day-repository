import {
  postListInput,
  postDeleteInput,
  postCreateInput,
  postUpdateInput,
} from 'common';
import { PostListEndpoint } from '../../domains/post/post-list.endpoint';
import { protectedProcedure } from '../../trpc/procedures';
import { router } from '../../trpc';
import { PostCreateEndpoint } from './post-create.endpoint';
import { PostDeleteEndpoint } from './post-delete.endpoint';
import { PostUpdateEndpoint } from './post-update.endpoint';

export const postRouter = router({
  create: protectedProcedure
    .meta({ requiredPermissions: ['post.create'] })
    .input(postCreateInput)
    .mutation(PostCreateEndpoint.createEndpoint(PostCreateEndpoint)),
  list: protectedProcedure
    .meta({ requiredPermissions: ['post.read'] })
    .input(postListInput)
    .query(PostListEndpoint.createEndpoint(PostListEndpoint)),
  update: protectedProcedure
    .meta({ requiredPermissions: ['post.update'] })
    .input(postUpdateInput)
    .mutation(PostUpdateEndpoint.createEndpoint(PostUpdateEndpoint)),
  delete: protectedProcedure
    .meta({ requiredPermissions: ['post.delete'] })
    .input(postDeleteInput)
    .mutation(PostDeleteEndpoint.createEndpoint(PostDeleteEndpoint)),
});

import {
  pagedListOutputFactory,
  pagedListInputFactory,
} from '@base/common-base';
import { z } from 'zod';

import { postSchema } from './post.types';

export const postListInput = pagedListInputFactory({
  filters: z.object({}).optional(),
  orderBy: ['id', 'created_at'] as const, // Simplified to only include 'id', add more fields as necessary.
});
export type PostListInputType = z.infer<typeof postListInput>;

export const postListOutput = pagedListOutputFactory(postSchema);
export type PostListOutputType = z.infer<typeof postListOutput>;

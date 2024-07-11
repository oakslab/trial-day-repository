import { z } from 'zod';
import { postSchema } from './post.types';

export const postDeleteInput = z.object({
  id: z.string(),
});
export type PostDeleteInputType = z.infer<typeof postDeleteInput>;

export const postDeleteOutput = postSchema;
export type PostDeleteOutputType = z.infer<typeof postDeleteOutput>;

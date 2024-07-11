import { z } from 'zod';
import { postInputSchema, postSchema } from './post.types';

export const postCreateInput = postInputSchema;
export type PostCreateInputType = z.infer<typeof postCreateInput>;

export const postCreateOutput = postSchema;
export type PostCreateOutputType = z.infer<typeof postCreateOutput>;

import { z } from 'zod';
import { postInputSchema } from './post.types';

export const postUpdateInput = postInputSchema;
export type PostUpdateInputType = z.infer<typeof postUpdateInput>;

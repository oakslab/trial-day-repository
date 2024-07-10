import { z } from 'zod';
import { userSchema } from './user.types';

export const userDeleteInput = z.object({
  id: z.string(),
});

export type UserDeleteInputType = z.infer<typeof userDeleteInput>;
export const userDeleteOutput = userSchema;
export type UserDeleteOutputType = z.infer<typeof userDeleteOutput>;

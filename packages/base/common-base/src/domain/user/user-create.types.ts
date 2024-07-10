import { z } from 'zod';
import { userInputSchema, userSchema } from './user.types';

export const userCreateInput = userInputSchema;
export type UserCreateInputType = z.infer<typeof userCreateInput>;

export const userCreateOutput = userSchema;
export type UserCreateOutputType = z.infer<typeof userCreateOutput>;

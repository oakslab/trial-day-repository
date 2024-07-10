import { z } from 'zod';
import { userInputSchema, userSchema } from './user.types';

export const userUpdateInput = userInputSchema
  .omit({ firstName: true, lastName: true })
  .extend({
    firstName: z.string().trim().nullable(),
    lastName: z.string().trim().nullable(),
  });

export type UserUpdateInputType = z.infer<typeof userUpdateInput>;
export const userUpdateOutput = userSchema;
export type UserUpdateOutputType = z.infer<typeof userUpdateOutput>;

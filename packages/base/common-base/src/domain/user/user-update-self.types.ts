import { z } from 'zod';
import { userInputSchema, userSchema } from './user.types';

export const userUpdateSelfInput = userInputSchema
  .omit({ firstName: true, lastName: true })
  .extend({
    firstName: z.string().trim().nullable(),
    lastName: z.string().trim().nullable(),
  });

export type UserUpdateSelfInputType = z.infer<typeof userUpdateSelfInput>;
export const userUpdateSelfOutput = userSchema;
export type UserUpdateSelfOutputType = z.infer<typeof userUpdateSelfOutput>;

import { z } from 'zod';
import { userInputSchema } from './user.types';

export const userInviteInput = userInputSchema.pick({
  email: true,
  role: true,
});
export type UserInviteInputType = z.infer<typeof userInviteInput>;

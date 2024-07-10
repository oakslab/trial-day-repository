import { z } from 'zod';
import { userInputSchema } from './user.types';

export const userResendInviteInput = userInputSchema.pick({
  id: true,
});
export type UserResendInviteInputType = z.infer<typeof userResendInviteInput>;

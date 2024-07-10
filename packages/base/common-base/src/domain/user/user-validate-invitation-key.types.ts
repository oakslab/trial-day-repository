import { z } from 'zod';

export const userValidateInvitationKeyInput = z.object({
  invitationKey: z.string().min(1, 'Invitation key is required'),
});

export type UserValidateInvitationKeyInputType = z.infer<
  typeof userValidateInvitationKeyInput
>;

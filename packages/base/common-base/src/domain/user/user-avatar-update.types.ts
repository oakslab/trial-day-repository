import { z } from 'zod';

export const userAvatarUpdateOutputSchema = z.object({
  avatarId: z.string(),
  signedUrl: z.string(),
});

export const userAvatarUpdateInputSchema = z.object({
  userId: z.string(),
  filename: z.string(),
});

export type UserAvatarUpdateOutputType = z.infer<
  typeof userAvatarUpdateOutputSchema
>;

export type UserAvatarUpdateInputType = z.infer<
  typeof userAvatarUpdateInputSchema
>;

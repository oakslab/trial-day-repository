import z from 'zod';

export const userDisableInput = z.object({
  id: z.string(),
});

export type UserDisableInputType = z.infer<typeof userDisableInput>;

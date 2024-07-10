import z from 'zod';

export const userEnableInput = z.object({
  id: z.string(),
});

export type UserEnableInputType = z.infer<typeof userEnableInput>;

import { z } from 'zod';
import { userInputSchema } from './user.types';

export const userActOnBehalfInput = userInputSchema.pick({ id: true });
export type UserActOnBehalfInputType = z.infer<typeof userActOnBehalfInput>;

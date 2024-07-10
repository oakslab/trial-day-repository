import { z } from 'zod';
import { UserStatusToCount, userStatuses } from './user.types';

export const userListCountByStatusOutput: z.ZodType<UserStatusToCount> =
  z.object({
    ...userStatuses.reduce(
      (obj, key) => ({ ...obj, [key]: z.number().optional() }),
      {},
    ),
  }) as z.ZodTypeAny;

export type UserListCountByStatusOutputType = z.infer<
  typeof userListCountByStatusOutput
>;

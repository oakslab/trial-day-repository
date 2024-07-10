import { z } from 'zod';
import {
  pagedListOutputFactory,
  pagedListInputFactory,
} from '../../common/query.types';
import { userSchema, userRoleSchema, userStatusSchema } from './user.types';

export const userListInput = pagedListInputFactory({
  filters: z
    .object({
      role: userRoleSchema.array().optional(),
      status: userStatusSchema.optional(),
      searchTerm: z
        .string()
        .optional()
        .transform((val) => val?.trim()),
      createdBetween: z
        .object({
          start: z.date().nullable(),
          end: z.date().nullable(),
        })
        .optional(),
    })
    .optional(),
  orderBy: ['firstName', 'lastName', 'email'],
});

export type UserListInputType = z.infer<typeof userListInput>;

export const userListOutput = pagedListOutputFactory(userSchema);
export type UserListOutputType = z.infer<typeof userListOutput>;

import z from 'zod';
import { parseError, requiredError } from '../../errors/common';

//TODO: this should be ideally infered from Prisma UserRole const but I have not find way to do
// it in a way that would work for zod type-safaty
export const userRoles = ['USER', 'ADMIN'] as const;

export const userRoleSchema = z.enum(userRoles);

export const userStatuses = [
  'PENDING',
  'ACTIVE',
  'REJECTED',
  'BANNED',
] as const;
export const userStatusSchema = z.enum(userStatuses);
export type UserStatus = z.infer<typeof userStatusSchema>;
export type UserStatusToCount = { [key in UserStatus]?: number };

export const userSchema = z.object({
  id: z.string(), //z.string().cuid() does not work with Prisma genereted cuids for some reason
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  role: userRoleSchema,
  status: userStatusSchema,
  avatarId: z.string().nullable(),
  invitationKey: z.string().nullable(),
});

export const userInputSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().trim().min(1, requiredError('First name')),
  lastName: z.string().trim().min(1, requiredError('Last name')),
  email: z
    .string()
    .email(parseError('Email'))
    .min(1, requiredError('Email'))
    .transform((email) => email.toLowerCase()),
  role: userRoleSchema,
  status: z.enum(userStatuses),
});

export type User = z.infer<typeof userSchema>;

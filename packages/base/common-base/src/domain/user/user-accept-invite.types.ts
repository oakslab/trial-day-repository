import { z } from 'zod';
import { weakPasswordError } from '../../authentication/util';
import { userInputSchema } from './user.types';

const passwordSchema = weakPasswordError(
  z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .min(1, 'Password is required'),
);

export const userAcceptInviteFormInput = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .refine((data) => {
      return data.split(' ').length === 2;
    }, 'Full name has to consist of at least first name and last name')
    .refine((data) => {
      return (
        (data.split(' ')[0]?.length || 0) > 0 &&
        (data.split(' ')[1]?.length || 0) > 0
      );
    }, 'Full name has to consist of at least first name and last name'),
  password: passwordSchema,
});
export type UserAcceptInviteFormInputType = z.infer<
  typeof userAcceptInviteFormInput
>;

export const userAcceptInviteInput = userInputSchema
  .pick({
    firstName: true,
    lastName: true,
  })
  .extend({
    password: passwordSchema,
    invitationKey: z.string().min(1, 'Invitation key is required'),
  });

export type UserAcceptInviteInputType = z.infer<typeof userAcceptInviteInput>;

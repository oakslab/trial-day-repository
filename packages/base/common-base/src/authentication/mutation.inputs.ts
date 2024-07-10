import { z } from 'zod';
import { userInputSchema } from '../domain/user';
import {
  EMAIL_TYPE_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from './errorMessages';
import { weakPasswordError } from './util';

export type LoginMutationInputType = z.infer<typeof loginMutationInput>;
export const loginMutationInput = z.object({
  email: z
    .string({
      invalid_type_error: EMAIL_TYPE_MESSAGE,
      required_error: EMAIL_REQUIRED_MESSAGE,
    })
    .min(1, EMAIL_REQUIRED_MESSAGE)
    .email({
      message: EMAIL_INVALID_MESSAGE,
    })
    .transform((email) => email.trim().toLowerCase()),
  password: z
    .string({
      invalid_type_error: PASSWORD_INVALID_MESSAGE,
      required_error: PASSWORD_REQUIRED_MESSAGE,
    })
    .min(1, PASSWORD_REQUIRED_MESSAGE),
});

export type SendResetPasswordEmailMutationInputType = z.infer<
  typeof sendResetPasswordEmailMutationInput
>;
export const sendResetPasswordEmailMutationInput = z.object({
  email: z
    .string({
      invalid_type_error: EMAIL_TYPE_MESSAGE,
      required_error: EMAIL_REQUIRED_MESSAGE,
    })
    .min(1, EMAIL_REQUIRED_MESSAGE)
    .email({
      message: EMAIL_INVALID_MESSAGE,
    })
    .transform((email) => email.trim().toLowerCase()),
});

export type ConfirmResetPasswordMutationInputType = z.infer<
  typeof confirmResetPasswordMutationInput
>;

export const confirmResetPasswordMutationInput = z.object({
  oobCode: z.string({
    invalid_type_error: 'Invalid OOB code',
    required_error: 'OOB code is required',
  }),
  newPassword: weakPasswordError(
    z.string({
      invalid_type_error: 'New password must be a string',
      required_error: 'New password is required',
    }),
  ),
});

export type ConfirmResetPasswordFormInputType = z.infer<
  typeof confirmResetPasswordFormInput
>;

export const confirmResetPasswordFormInput = confirmResetPasswordMutationInput
  .extend({
    reNewPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.newPassword === data.reNewPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['reNewPassword'],
    },
  );

export type ChangePasswordInputType = z.infer<typeof changePasswordInput>;
export const changePasswordInput = z
  .object({
    currentPassword: z.string({
      invalid_type_error: 'Current password must be a string',
      required_error: 'Current password is required',
    }),
    newPassword: weakPasswordError(
      z
        .string({
          invalid_type_error: 'New password must be a string',
        })
        .min(1, 'New password is required'),
    ),

    confirmNewPassword: z
      .string({
        invalid_type_error: 'Confirm new password must be a string',
      })
      .min(1, 'Confirm new password is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Confirm password does not match with the password',
    path: ['confirmNewPassword'],
  });

const signupCommonInput = z.object({
  firstName: z
    .string({
      invalid_type_error: 'First name must be a string',
      required_error: 'First name is required',
    })
    .min(1, 'First name is required'),
  lastName: z
    .string({
      invalid_type_error: 'Last name must be a string',
      required_error: 'Last name is required',
    })
    .min(1, 'Last name is required'),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .min(1, EMAIL_REQUIRED_MESSAGE)
    .email({
      message: 'Email must be a valid email address',
    })
    .transform((email) => email.trim().toLowerCase()),
});

export type SignupMutationInputType = z.infer<typeof signupMutationInput>;
export const signupMutationInput = signupCommonInput.extend({
  uid: z.string(),
});

export type SignupFormInputType = z.infer<typeof signupFormInput>;
export const signupFormInput = signupCommonInput
  .extend({
    password: weakPasswordError(
      z
        .string({
          invalid_type_error: PASSWORD_INVALID_MESSAGE,
        })
        .min(1, PASSWORD_REQUIRED_MESSAGE),
    ),
    confirmPassword: z
      .string({
        invalid_type_error: 'Confirm password must be a string',
      })
      .min(1, 'Confirm password is required'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  );

export type SendAuthEmailInputType = z.infer<typeof sendAuthEmailInputType>;
export const sendAuthEmailInputType = userInputSchema.pick({
  email: true,
});

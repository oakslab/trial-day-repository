import { FieldValidationError } from '@base/common-base';

export const SignupErrors = {
  EMAIL_EXISTS: new FieldValidationError('Email already registered', 'email'),
};

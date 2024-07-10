import { UserRole } from 'database';
import isString from 'lodash/isString.js';

export const isUserRole = (value: unknown): value is UserRole => {
  if (isString(value)) {
    return (Object.values(UserRole) as string[]).includes(value);
  }

  return false;
};

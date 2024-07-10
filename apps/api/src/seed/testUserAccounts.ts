import { UserRole } from 'database';
import { kebabCase } from 'lodash';

// user accounts to seed in the database and firebase
export const testUserAccounts = Object.values(UserRole).map((role) => {
  const kebabRole = kebabCase(role.split('_').join(' '));
  return {
    uid: `test.${kebabRole}@oakslab.com`,
    email: `test.${kebabRole}@oakslab.com`,
    firstName: 'Test',
    lastName: UserRole,
    role: role,
  };
});

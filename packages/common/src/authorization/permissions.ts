import {
  RoleToPermissionsMapping,
  hasPermissionForRoleMapping,
  SinglePermission,
} from '@base/common-base';
import { UserRole } from '../../../database';

// Define the permissions for each role
// Keep the highest level of permissions at the top (for seeds to work properly)
export const permissionRoleMapping: RoleToPermissionsMapping = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.USER]: ['self.*'],
};

// ---------------------------------------------------------------

export const topLevelRole = Object.keys(permissionRoleMapping)[0] as UserRole;

export const hasPermission = (
  role: UserRole,
  requiredPermission: SinglePermission,
) => {
  return hasPermissionForRoleMapping(permissionRoleMapping)(
    role,
    requiredPermission,
  );
};

if (!topLevelRole) {
  throw new Error(
    `No top level role found in "permissionRoleMapping".\n${JSON.stringify(permissionRoleMapping, null, 2)}`,
  );
}

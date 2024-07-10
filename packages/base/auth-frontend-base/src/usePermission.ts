import { useCallback, useMemo } from 'react';
import { Permissions, hasPermissionForRoleMapping } from '@base/common-base';
import { permissionRoleMapping } from 'common';
import { UserRole } from 'database';
import { useAuth } from './authContext';

const checkHasPermission = hasPermissionForRoleMapping(permissionRoleMapping);

export const usePermission = (
  // To have atleast one permission. https://stackoverflow.com/questions/49910889/typescript-array-with-minimum-length
  requiredPermissions: [Permissions[number], ...Permissions],
  role?: UserRole,
) => {
  const checkPermissions = useCallback(
    (userRole: UserRole) =>
      requiredPermissions.every((permission) =>
        checkHasPermission(userRole, permission),
      ),
    // RequiredPermissions are already array of string
    // if we put array in array comparison on react be effective
    requiredPermissions,
  );

  return useMemo(
    () => (role ? checkPermissions(role) : false),
    [role, checkPermissions],
  );
};

export const useMyPermission = (
  requiredPermissions: [Permissions[number], ...Permissions],
) => {
  const { userProfile } = useAuth();
  if (requiredPermissions.length > 0 && !userProfile) return false;
  return usePermission(requiredPermissions, userProfile?.role);
};

type PermissionObject<T extends Permissions[number]> = {
  [K in T]: boolean;
};

export type PermissionsList = [Permissions[number], ...Permissions];

/**
 * Hook to get the permissions object for the user
 * @param requiredPermissions Array of permissions
 * @returns Object with permissions as keys and boolean as values
 * @example
 * ```tsx
 * const permissions = useMyPermissionsObject(['user.create', 'user.update']);
 *
 * if (permissions['user.create']) {
 *  // Do something
 * }
 * ```
 */
export const useMyPermissionsObject = <T extends PermissionsList>(
  requiredPermissions: T,
): PermissionObject<T[number]> => {
  const { userProfile } = useAuth();

  const result: Partial<PermissionObject<T[number]>> = {};

  requiredPermissions.forEach((permission) => {
    result[permission as keyof typeof result] = usePermission(
      [permission],
      userProfile?.role,
    );
  });

  return useMemo(
    () => result,
    [userProfile, requiredPermissions],
  ) as PermissionObject<T[number]>;
};

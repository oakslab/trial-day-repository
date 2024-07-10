import { PrismaClient, UserRole } from 'database';

export type ModelNames =
  | Exclude<keyof PrismaClient, '$' | `$${string}` | `$$${string}` | symbol>
  | 'self';
export const allActions: AllActions = '*';
export type AllActions = '*';
export type Actions = 'create' | 'read' | 'update' | 'delete' | AllActions;

export const extraActions = ['user.actAs', 'user.invite', 'user.ban'] as const;

export type ExtraActionsType = (typeof extraActions)[number];

type SinglePositivePermission =
  | `${ModelNames}.${Actions}`
  | AllActions
  | ExtraActionsType;

export type SinglePermission =
  | SinglePositivePermission
  | `!${SinglePositivePermission}`;

export type Permissions = SinglePermission[];

export type RoleToPermissionsMapping = Record<UserRole, Permissions>;

/**
 * Check permissions for redundant usage
 * @param permissions Permission array ex: ['user.*', 'auditLog.*', 'self.*'] or even ['*]
 * @returns boolean
 */
export function validatePermissions(
  permissions: Permissions,
): permissions is Permissions {
  const modelMap = new Map<string, Set<string>>();

  for (const perm of permissions) {
    if (perm === allActions) return true;
    const [model, action] = perm.split('.') as [ModelNames, Actions];
    if (!modelMap.has(model)) {
      modelMap.set(model, new Set());
    }
    modelMap.get(model)!.add(action);
  }

  for (const [model, actions] of modelMap) {
    if (actions.has(allActions) && actions.size > 1) {
      console.error(
        `Error: Redundant permission for ${model}. Remove other actions when "*" is present.`,
      );
      return false;
    }
  }

  return true;
}

/**
 * Returns the role mapping as it is if the permissions are valid
 * @param mapping Role and user mapping
 * @returns
 */
export function createRoleMapping<T extends RoleToPermissionsMapping>(
  mapping: T,
): T {
  const entries = Object.entries(mapping) as [UserRole, Permissions][];
  for (const [role, permissions] of entries) {
    if (!validatePermissions(permissions)) {
      throw new Error(`Invalid permissions for role ${role}`);
    }
  }
  return mapping;
}

/**
 * Check if the role has the permission
 * @param role {UserRole}
 * @param permission {SinglePermission} ex: 'user.create'
 * @returns boolean
 */
export const hasPermissionForRoleMapping =
  (roleMapping: RoleToPermissionsMapping) =>
  (role: UserRole, permission: SinglePermission): boolean => {
    const rolePermissions = roleMapping[role];
    const [requestedModel, requestedAction] = permission.split('.') as [
      ModelNames,
      Actions,
    ];
    const permissionMap = new Map<ModelNames, Set<Actions>>();

    // If some of the permission is negating the requested permission, return false
    if (
      rolePermissions.some((rolePermission) => {
        if (!rolePermission.startsWith('!')) return;

        const [roleModel, roleAction] = rolePermission.slice(1).split('.') as [
          ModelNames,
          Actions,
        ];

        return (
          roleModel === requestedModel &&
          (roleAction === requestedAction || roleAction === allActions)
        );
      })
    )
      return false;

    // if user has all permissions just return true
    if (rolePermissions.includes(allActions)) return true;

    for (const rolePermission of rolePermissions) {
      if (rolePermission === allActions) return true;
      const [model, action] = rolePermission.split('.') as [
        ModelNames,
        Actions,
      ];
      if (!permissionMap.has(model)) {
        permissionMap.set(model, new Set());
      }
      permissionMap.get(model)!.add(action);
    }

    const permissionFromSet = permissionMap.get(requestedModel);

    if (permissionFromSet?.has(allActions)) {
      return true;
    }

    // Check if the role has the specific permission
    return permissionFromSet?.has(requestedAction) ?? false;
  };

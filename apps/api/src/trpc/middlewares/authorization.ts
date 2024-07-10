import {
  createRoleMapping,
  hasPermissionForRoleMapping,
} from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { permissionRoleMapping } from 'common';
import { middleware } from '..';
import { ProtectedContext } from '../types';

const hasPermission = hasPermissionForRoleMapping(
  createRoleMapping(permissionRoleMapping),
);

export const checkPermissionMiddleware = middleware(async (opts) => {
  const user = opts.ctx.user;
  const requiredPermissions = opts.meta?.requiredPermissions ?? [];
  if (user && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      hasPermission(user.role, permission),
    );

    if (hasAllPermissions) {
      return opts.next({
        ctx: {
          ...opts.ctx,
          user,
        } satisfies ProtectedContext,
      });
    }
  }
  /**
   * If the user does not have the required permissions, throw a FORBIDDEN error
   */
  throw new TRPCError({
    code: 'FORBIDDEN',
  });
});

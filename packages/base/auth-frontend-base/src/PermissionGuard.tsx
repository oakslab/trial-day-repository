import { ReactNode } from 'react';
import { Permissions } from '@base/common-base';
import { useMyPermission } from './usePermission';

export interface PermissionGuardProps {
  permissions: [Permissions[number], ...Permissions];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  permissions,
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const hasPermission = useMyPermission(permissions);

  return hasPermission ? children : fallback;
};

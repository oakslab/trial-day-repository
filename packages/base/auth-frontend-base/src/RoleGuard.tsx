import { ReactNode } from 'react';
import { UserRole } from 'database';
import { useAuth } from './authContext';

export const RoleGuard = ({
  role,
  children,
  fallback,
}: {
  role: UserRole[] | UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  const { userProfile } = useAuth();
  if (!userProfile) {
    return null;
  }

  if (Array.isArray(role)) {
    return role.includes(userProfile.role) ? children : fallback;
  }

  return userProfile?.role === role ? children : fallback;
};

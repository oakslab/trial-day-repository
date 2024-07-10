import { userRolePortalMapping } from 'common';
import { UserRole } from 'database';
import { apiEnv } from '../lib/env';

export const getPortalUrlBasedOnRole = (role: UserRole) =>
  apiEnv[userRolePortalMapping[role]];

import { UserRole } from 'database';

// TODO: change to Role mapping
/**
 * Mapping of user roles to portal URLs
 * URLs must be part of the environment variables
 * (meaning e.g. `ADMIN_URL` and `WEB_URL` must be defined in the `.env` file)
 */
export const userRolePortalMapping = {
  ADMIN: 'ADMIN_URL',
  USER: 'WEB_URL',
} as const satisfies { [key in UserRole]: string };

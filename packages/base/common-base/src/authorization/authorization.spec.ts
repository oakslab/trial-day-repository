import { UserRole } from 'database';
import {
  createRoleMapping,
  hasPermissionForRoleMapping,
  validatePermissions,
  RoleToPermissionsMapping,
  type Permissions,
} from './authorization';

const userRole1 = Object.values(UserRole)[0] as UserRole;
const userRole2 = Object.values(UserRole)[1] as UserRole;

describe('Authorization', () => {
  describe('validatePermissions succesfully', () => {
    it('should validate permissions', () => {
      const permissions: Permissions = [
        'auditLog.*',
        'self.create',
        'user.create',
      ];
      expect(validatePermissions(permissions)).toBe(true);
    });

    it('should validate permissions with wildcard', () => {
      const permissions: Permissions = ['*'];
      expect(validatePermissions(permissions)).toBe(true);
    });

    it('should validate permissions with negation', () => {
      const permissions: Permissions = ['!user.*', 'auditLog.*'];
      expect(validatePermissions(permissions)).toBe(true);
    });

    it('should fail to validate permissions', () => {
      jest.spyOn(console, 'error').mockImplementation();

      const permissions: Permissions = [
        'auditLog.*',
        'auditLog.create',
        'user.create',
      ];
      expect(validatePermissions(permissions)).toBe(false);

      jest.spyOn(console, 'error').mockRestore();
    });
  });

  describe('createRoleMapping', () => {
    it('should create role mapping', () => {
      const permissions: Permissions = [
        'auditLog.*',
        'self.create',
        'user.create',
      ];
      const mapping = {
        [userRole1]: permissions,
        [userRole2]: permissions,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(() => createRoleMapping(mapping)).not.toThrow();
    });

    it('should fail to create role mapping', () => {
      jest.spyOn(console, 'error').mockImplementation();

      const permissions: Permissions = [
        'auditLog.*',
        'auditLog.create',
        'user.create',
      ];
      const mapping = {
        [userRole1]: permissions,
        [userRole2]: permissions,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => createRoleMapping(mapping as any)).toThrow();

      jest.spyOn(console, 'error').mockRestore();
    });
  });

  describe('hasPermissionForRoleMapping', () => {
    const permissions: RoleToPermissionsMapping = {
      [userRole1]: ['user.*', 'self.*', 'auditLog.*'],
      [userRole2]: ['self.*'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const userRole = userRole2;
    const adminRole = userRole1;

    const checkPermission = hasPermissionForRoleMapping(permissions);
    it('[User] should pass check permission', () => {
      expect(checkPermission(userRole, 'self.read')).toBe(true);
      expect(checkPermission(userRole, 'self.create')).toBe(true);
      expect(checkPermission(userRole, 'self.delete')).toBe(true);
      expect(checkPermission(userRole, 'self.update')).toBe(true);
    });

    it('[User] should work with wildcard as root permission', () => {
      const checkAllPermissions = hasPermissionForRoleMapping({
        [userRole2]: ['*'],
        [userRole1]: ['*'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      const all = [
        'self.read',
        'self.create',
        'self.delete',
        'self.update',
        'auditLog.read',
        'auditLog.create',
        'auditLog.delete',
        'auditLog.update',
        'user.read',
        'user.create',
        'user.delete',
        'user.update',
        'user.invite',
        'user.ban',
        'user.actAs',
      ] as const;

      all.forEach((permission) => {
        expect(checkAllPermissions(userRole, permission)).toBe(true);
        expect(checkAllPermissions(adminRole, permission)).toBe(true);
      });
    });

    it('[User] should work with negation', () => {
      const checkNegatedPermissions = hasPermissionForRoleMapping({
        [userRole2]: ['user.*', 'self.read', '!user.update'],
        [userRole1]: ['*', '!user.*'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      expect(checkNegatedPermissions(userRole, 'self.read')).toBe(true);
      expect(checkNegatedPermissions(userRole, 'user.read')).toBe(true);
      expect(checkNegatedPermissions(adminRole, 'auditLog.read')).toBe(true);
      expect(checkNegatedPermissions(adminRole, 'user.read')).toBe(false);
      expect(checkNegatedPermissions(userRole, 'user.update')).toBe(false);
    });

    it('[User] should fail to check permission', () => {
      expect(checkPermission(userRole, 'auditLog.read')).toBe(false);
      expect(checkPermission(userRole, 'auditLog.create')).toBe(false);
      expect(checkPermission(userRole, 'auditLog.delete')).toBe(false);
      expect(checkPermission(userRole, 'auditLog.update')).toBe(false);
    });

    it('[Admin] should pass check permission', () => {
      expect(checkPermission(adminRole, 'self.read')).toBe(true);
      expect(checkPermission(adminRole, 'self.create')).toBe(true);
      expect(checkPermission(adminRole, 'self.delete')).toBe(true);
      expect(checkPermission(adminRole, 'self.update')).toBe(true);
    });

    it('[Admin] should fail to check permission', () => {
      expect(checkPermission(adminRole, 'auditLog.read')).toBe(true);
      expect(checkPermission(adminRole, 'auditLog.create')).toBe(true);
      expect(checkPermission(adminRole, 'auditLog.delete')).toBe(true);
      expect(checkPermission(adminRole, 'auditLog.update')).toBe(true);
    });
  });
});

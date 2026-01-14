import { Permission, UserRole } from '@/types/auth'

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'products:view',
    'products:create',
    'products:edit',
    'products:delete',
    'settings:view',
    'settings:edit',
    'dashboard:view',
  ],
  user: [
    'products:view',
    'dashboard:view',
  ],
  guest: [
    'products:view',
  ],
}

// Check if a role has a specific permission
export function roleHasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

// Check if a role has any of the specified permissions
export function roleHasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) =>
    ROLE_PERMISSIONS[role].includes(permission)
  )
}

// Check if a role has all of the specified permissions
export function roleHasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) =>
    ROLE_PERMISSIONS[role].includes(permission)
  )
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role]
}

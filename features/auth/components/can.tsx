'use client'

import { useAuth } from '../context/auth-context'
import { Permission } from '@/types/auth'

interface CanProps {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  role?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * Component that conditionally renders children based on permissions
 *
 * @example
 * // Show content only if user has specific permission
 * <Can permission="users:edit">
 *   <Button>Edit User</Button>
 * </Can>
 *
 * @example
 * // Show content if user has ANY of the permissions
 * <Can permissions={["users:edit", "users:delete"]}>
 *   <Button>Manage User</Button>
 * </Can>
 *
 * @example
 * // Show content if user has ALL permissions
 * <Can permissions={["users:edit", "users:delete"]} requireAll>
 *   <Button>Full Access</Button>
 * </Can>
 *
 * @example
 * // Show fallback if permission denied
 * <Can permission="users:edit" fallback={<p>Access Denied</p>}>
 *   <Button>Edit User</Button>
 * </Can>
 */
export function Can({
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  children,
}: CanProps) {
  const auth = useAuth()

  // Check role if specified
  if (role && !auth.hasRole(role)) {
    return <>{fallback}</>
  }

  // Check single permission
  if (permission && !auth.hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? auth.hasAllPermissions(permissions)
      : auth.hasAnyPermission(permissions)

    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

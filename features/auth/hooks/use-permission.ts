import { useAuth } from '../context/auth-context'
import { Permission } from '@/types/auth'

export function usePermission(permission: Permission) {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

export function useAnyPermission(permissions: Permission[]) {
  const { hasAnyPermission } = useAuth()
  return hasAnyPermission(permissions)
}

export function useAllPermissions(permissions: Permission[]) {
  const { hasAllPermissions } = useAuth()
  return hasAllPermissions(permissions)
}

export function useRole(role: string) {
  const { hasRole } = useAuth()
  return hasRole(role)
}

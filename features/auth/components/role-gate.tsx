'use client'

import { useAuth } from '../context/auth-context'
import { UserRole } from '@/types/auth'

interface RoleGateProps {
  roles: UserRole[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * Component that conditionally renders children based on user role
 *
 * @example
 * <RoleGate roles={["admin"]}>
 *   <AdminPanel />
 * </RoleGate>
 *
 * @example
 * <RoleGate roles={["admin", "user"]} fallback={<p>Guests cannot access</p>}>
 *   <DashboardContent />
 * </RoleGate>
 */
export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

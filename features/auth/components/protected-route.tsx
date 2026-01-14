'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/auth-context'
import { Permission } from '@/types/auth'
import { getRoutePermissions } from '@/lib/permissions/routes'

interface ProtectedRouteProps {
  children: React.ReactNode
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * Component that protects routes based on permissions
 * Automatically redirects unauthorized users
 *
 * @example
 * // In a page layout or component
 * <ProtectedRoute permissions={["users:view"]}>
 *   <UsersPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  permissions,
  requireAll = false,
  fallback = <div>Access Denied</div>,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const auth = useAuth()

  // Get route permissions if not explicitly provided
  const requiredPermissions = permissions || getRoutePermissions(pathname)

  useEffect(() => {
    if (auth.isLoading) return

    if (!auth.isAuthenticated) {
      router.push(`${redirectTo}?redirect=${pathname}`)
      return
    }

    if (requiredPermissions.length > 0) {
      const hasAccess = requireAll
        ? auth.hasAllPermissions(requiredPermissions)
        : auth.hasAnyPermission(requiredPermissions)

      if (!hasAccess) {
        router.push('/unauthorized')
      }
    }
  }, [
    auth.isAuthenticated,
    auth.isLoading,
    pathname,
    redirectTo,
    requiredPermissions,
    requireAll,
    router,
  ])

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (!auth.isAuthenticated) {
    return null
  }

  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? auth.hasAllPermissions(requiredPermissions)
      : auth.hasAnyPermission(requiredPermissions)

    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

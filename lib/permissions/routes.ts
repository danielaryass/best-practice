import { Permission } from '@/types/auth'

// Define which permissions are required for each route
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard': ['dashboard:view'],
  '/users': ['users:view'],
  '/users/create': ['users:create'],
  '/users/[id]/edit': ['users:edit'],
  '/products': ['products:view'],
  '/products/create': ['products:create'],
  '/settings': ['settings:view'],
}

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
]

// Check if a route is public
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === path) return true
    // Handle dynamic routes
    const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
    return new RegExp(`^${routePattern}$`).test(path)
  })
}

// Get required permissions for a route
export function getRoutePermissions(path: string): Permission[] {
  // Exact match
  if (ROUTE_PERMISSIONS[path]) {
    return ROUTE_PERMISSIONS[path]
  }

  // Check for dynamic route match
  for (const [route, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
    if (new RegExp(`^${routePattern}$`).test(path)) {
      return permissions
    }
  }

  return []
}

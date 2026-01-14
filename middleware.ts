import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a basic example. In production, you'd validate JWT tokens here
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for auth token (you can use cookies or headers)
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // In production, validate the token and check permissions here
  // For now, we'll let the client-side handle permission checks

  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}

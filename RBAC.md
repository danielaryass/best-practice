# Role-Based Access Control (RBAC) Guide

This document explains how to implement and use role-based access control and permissions in your application.

## Table of Contents

1. [Overview](#overview)
2. [Roles & Permissions](#roles--permissions)
3. [Authentication Setup](#authentication-setup)
4. [Protecting Routes](#protecting-routes)
5. [Protecting Components](#protecting-components)
6. [Using Hooks](#using-hooks)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

---

## Overview

The RBAC system provides:
- **Role-based access control** (admin, user, guest)
- **Fine-grained permissions** (users:view, users:create, etc.)
- **Component-level protection** (show/hide based on permissions)
- **Route-level protection** (redirect unauthorized users)
- **Custom permission checks** (hooks for complex logic)

### Architecture

```
├── types/
│   └── auth.ts                    # Auth types & permissions
├── lib/
│   └── permissions/
│       ├── roles.ts               # Role definitions
│       └── routes.ts              # Route permissions
├── features/
│   └── auth/
│       ├── context/
│       │   └── auth-context.tsx   # Auth provider & state
│       ├── components/
│       │   ├── can.tsx            # Permission component
│       │   ├── protected-route.tsx # Route protection
│       │   └── role-gate.tsx      # Role-based rendering
│       └── hooks/
│           └── use-permission.ts  # Permission hooks
└── middleware.ts                  # Route middleware
```

---

## Roles & Permissions

### Defined Roles

```typescript
type UserRole = 'admin' | 'user' | 'guest'
```

### Permission Types

```typescript
type Permission =
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'products:view'
  | 'products:create'
  | 'products:edit'
  | 'products:delete'
  | 'settings:view'
  | 'settings:edit'
  | 'dashboard:view'
```

### Role Permissions Matrix

| Permission | Admin | User | Guest |
|------------|-------|------|-------|
| users:view | ✅ | ❌ | ❌ |
| users:create | ✅ | ❌ | ❌ |
| users:edit | ✅ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ |
| products:view | ✅ | ✅ | ✅ |
| products:create | ✅ | ❌ | ❌ |
| products:edit | ✅ | ❌ | ❌ |
| products:delete | ✅ | ❌ | ❌ |
| settings:view | ✅ | ❌ | ❌ |
| settings:edit | ✅ | ❌ | ❌ |
| dashboard:view | ✅ | ✅ | ❌ |

### Adding New Permissions

1. **Define the permission** in `types/auth.ts`:
```typescript
type Permission =
  | 'users:view'
  | 'orders:create'  // New permission
```

2. **Assign to roles** in `lib/permissions/roles.ts`:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['users:view', 'orders:create'],
  user: ['orders:create'],
  guest: [],
}
```

3. **Use in routes** (optional) in `lib/permissions/routes.ts`:
```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/orders/create': ['orders:create'],
}
```

---

## Authentication Setup

### Auth Provider

The `AuthProvider` manages authentication state and is already configured in `app/providers.tsx`:

```tsx
import { AuthProvider } from '@/features/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
```

### Using Auth Context

```tsx
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login(userData)}>Login</button>
      )}
    </div>
  )
}
```

---

## Protecting Routes

### Method 1: Using ProtectedRoute Component

Wrap your page content with `ProtectedRoute`:

```tsx
// app/(dashboard)/admin/page.tsx
import { ProtectedRoute } from '@/features/auth'

export default function AdminPage() {
  return (
    <ProtectedRoute permissions={['users:edit', 'users:delete']} requireAll>
      <div>Admin content here</div>
    </ProtectedRoute>
  )
}
```

**Props:**
- `permissions` - Array of required permissions
- `requireAll` - If true, user must have ALL permissions (default: false)
- `fallback` - Component to show if unauthorized (default: "Access Denied")
- `redirectTo` - Where to redirect if not authenticated (default: "/login")

### Method 2: Auto Route Protection

Routes are automatically protected based on `lib/permissions/routes.ts`:

```typescript
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard': ['dashboard:view'],
  '/users': ['users:view'],
}
```

The `ProtectedRoute` component automatically reads these permissions.

### Method 3: Middleware Protection

Server-side protection in `middleware.ts` checks authentication before page loads:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

---

## Protecting Components

### Using the `Can` Component

Show/hide components based on permissions:

```tsx
import { Can } from '@/features/auth'

function UserActions() {
  return (
    <div>
      {/* Show button only if user has permission */}
      <Can permission="users:edit">
        <button>Edit User</button>
      </Can>

      {/* Show button if user has ANY of these permissions */}
      <Can permissions={['users:edit', 'users:delete']}>
        <button>Manage User</button>
      </Can>

      {/* Show button if user has ALL permissions */}
      <Can permissions={['users:edit', 'users:delete']} requireAll>
        <button>Full Access</button>
      </Can>

      {/* Show fallback if no permission */}
      <Can
        permission="users:delete"
        fallback={<p>You cannot delete users</p>}
      >
        <button>Delete User</button>
      </Can>
    </div>
  )
}
```

**Props:**
- `permission` - Single permission to check
- `permissions` - Array of permissions to check
- `requireAll` - Require all permissions (default: false)
- `role` - Check by role instead of permission
- `fallback` - Component to show if no permission

### Using RoleGate Component

Show/hide based on user role:

```tsx
import { RoleGate } from '@/features/auth'

function Dashboard() {
  return (
    <div>
      {/* Show only to admins */}
      <RoleGate roles={['admin']}>
        <AdminPanel />
      </RoleGate>

      {/* Show to admins OR users */}
      <RoleGate roles={['admin', 'user']}>
        <DashboardContent />
      </RoleGate>

      {/* With fallback */}
      <RoleGate
        roles={['admin']}
        fallback={<p>Admin access required</p>}
      >
        <AdvancedSettings />
      </RoleGate>
    </div>
  )
}
```

---

## Using Hooks

### useAuth Hook

Access authentication state and methods:

```tsx
import { useAuth } from '@/features/auth'

function MyComponent() {
  const {
    user,                    // Current user object
    isAuthenticated,         // Boolean
    isLoading,              // Boolean
    login,                  // Function to login
    logout,                 // Function to logout
    hasPermission,          // Function to check permission
    hasAnyPermission,       // Check if has any of permissions
    hasAllPermissions,      // Check if has all permissions
    hasRole,               // Check role
  } = useAuth()

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isAuthenticated && <p>Hello {user?.name}</p>}
    </div>
  )
}
```

### usePermission Hook

Check a single permission:

```tsx
import { usePermission } from '@/features/auth'

function EditButton() {
  const canEdit = usePermission('users:edit')

  if (!canEdit) return null

  return <button>Edit</button>
}
```

### useAnyPermission Hook

Check if user has ANY of the permissions:

```tsx
import { useAnyPermission } from '@/features/auth'

function ManageButton() {
  const canManage = useAnyPermission(['users:edit', 'users:delete'])

  if (!canManage) return null

  return <button>Manage Users</button>
}
```

### useAllPermissions Hook

Check if user has ALL permissions:

```tsx
import { useAllPermissions } from '@/features/auth'

function FullAccessButton() {
  const hasFullAccess = useAllPermissions(['users:edit', 'users:delete'])

  if (!hasFullAccess) return null

  return <button>Full Access</button>
}
```

### useRole Hook

Check user role:

```tsx
import { useRole } from '@/features/auth'

function AdminBadge() {
  const isAdmin = useRole('admin')

  if (!isAdmin) return null

  return <span className="badge">Admin</span>
}
```

---

## Best Practices

### 1. Principle of Least Privilege
Give users only the permissions they need:

```typescript
// ❌ Bad - Too broad
<Can permission="users:view">
  <DeleteUserButton />
</Can>

// ✅ Good - Specific permission
<Can permission="users:delete">
  <DeleteUserButton />
</Can>
```

### 2. Use Descriptive Permission Names
Follow the pattern: `resource:action`

```typescript
// ✅ Good
'users:view'
'products:create'
'settings:edit'

// ❌ Bad
'viewUsers'
'create'
'edit-settings'
```

### 3. Protect at Multiple Levels

Layer your security:

```tsx
// 1. Route protection
<ProtectedRoute permissions={['users:view']}>
  {/* 2. Component protection */}
  <Can permission="users:edit">
    <EditButton />
  </Can>
</ProtectedRoute>
```

### 4. Use Hooks for Complex Logic

```tsx
function UserCard({ user }) {
  const canEdit = usePermission('users:edit')
  const canDelete = usePermission('users:delete')
  const isOwn = useAuth().user?.id === user.id

  // Complex permission logic
  const canManage = (canEdit || canDelete) && !isOwn

  if (!canManage) return null

  return <ManageButton />
}
```

### 5. Always Have Fallbacks

Provide feedback when users lack permissions:

```tsx
<Can
  permission="users:delete"
  fallback={
    <div className="text-muted">
      Contact your administrator for delete access
    </div>
  }
>
  <DeleteButton />
</Can>
```

### 6. Server-Side Validation

Always validate permissions on the server:

```typescript
// app/api/users/[id]/route.ts
export async function DELETE(request: Request) {
  const user = await getCurrentUser(request)

  if (!user || !hasPermission(user, 'users:delete')) {
    return new Response('Unauthorized', { status: 403 })
  }

  // Delete user...
}
```

---

## Examples

### Example 1: Protected Dashboard

```tsx
// app/(dashboard)/dashboard/page.tsx
import { ProtectedRoute, Can, useAuth } from '@/features/auth'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute permissions={['dashboard:view']}>
      <div>
        <h1>Welcome {user?.name}</h1>

        <Can permission="users:view">
          <Link href="/users">Manage Users</Link>
        </Can>

        <Can permission="products:create">
          <Link href="/products/create">Create Product</Link>
        </Can>

        <button onClick={logout}>Logout</button>
      </div>
    </ProtectedRoute>
  )
}
```

### Example 2: Conditional Button

```tsx
import { Can } from '@/features/auth'
import { Button } from '@/components/ui/button'

function UserTable({ users }) {
  return (
    <table>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <Can permission="users:edit">
                <Button onClick={() => handleEdit(user)}>
                  Edit
                </Button>
              </Can>

              <Can permission="users:delete">
                <Button variant="destructive" onClick={() => handleDelete(user)}>
                  Delete
                </Button>
              </Can>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Example 3: Role-Based Sidebar

```tsx
import { RoleGate } from '@/features/auth'

function Sidebar() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>

      <RoleGate roles={['admin', 'user']}>
        <Link href="/products">Products</Link>
      </RoleGate>

      <RoleGate roles={['admin']}>
        <Link href="/users">Users</Link>
        <Link href="/settings">Settings</Link>
      </RoleGate>
    </nav>
  )
}
```

### Example 4: Custom Hook with Complex Logic

```tsx
import { useAuth, usePermission } from '@/features/auth'

function useCanManageUser(userId: string) {
  const { user } = useAuth()
  const canEdit = usePermission('users:edit')
  const canDelete = usePermission('users:delete')

  // Can't manage yourself
  const isOwnProfile = user?.id === userId

  return (canEdit || canDelete) && !isOwnProfile
}

// Usage
function UserActions({ userId }) {
  const canManage = useCanManageUser(userId)

  if (!canManage) return null

  return <ManageButton />
}
```

### Example 5: Dynamic Permission Check

```tsx
function ResourceActions({ resource, action }) {
  const permission = `${resource}:${action}` as Permission
  const hasAccess = usePermission(permission)

  return hasAccess ? <ActionButton /> : null
}

// Usage
<ResourceActions resource="users" action="edit" />
<ResourceActions resource="products" action="delete" />
```

---

## Testing

### Testing Protected Components

```tsx
import { render } from '@testing-library/react'
import { AuthProvider } from '@/features/auth'

const mockUser = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
}

function renderWithAuth(component, user = mockUser) {
  return render(
    <AuthProvider initialUser={user}>
      {component}
    </AuthProvider>
  )
}

test('shows edit button to admin', () => {
  const { getByText } = renderWithAuth(<UserActions />, mockUser)
  expect(getByText('Edit')).toBeInTheDocument()
})
```

---

## Summary

- Use `<ProtectedRoute>` to protect entire pages
- Use `<Can>` to show/hide components based on permissions
- Use `<RoleGate>` to show/hide based on roles
- Use hooks (`usePermission`, `useAuth`) for custom logic
- Always validate permissions on the server side
- Follow the principle of least privilege
- Provide clear feedback when access is denied

For more examples, see the example pages in:
- `/app/(auth)/login` - Login page
- `/app/(dashboard)/dashboard` - Protected dashboard
- `/app/(dashboard)/settings` - Settings with permission checks
- `/app/(dashboard)/users` - Users page with RBAC

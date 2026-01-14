# RBAC Quick Reference

## Quick Setup Checklist

- [x] AuthProvider added to app/providers.tsx
- [x] Types defined in types/auth.ts
- [x] Permissions configured in lib/permissions/
- [x] Middleware configured for route protection

## Common Usage Patterns

### 1. Protect a Page

```tsx
import { ProtectedRoute } from '@/features/auth'

export default function MyPage() {
  return (
    <ProtectedRoute permissions={['resource:view']}>
      <YourContent />
    </ProtectedRoute>
  )
}
```

### 2. Show/Hide Button

```tsx
import { Can } from '@/features/auth'

<Can permission="users:edit">
  <button>Edit</button>
</Can>
```

### 3. Check Permission in Code

```tsx
import { usePermission } from '@/features/auth'

const canEdit = usePermission('users:edit')
if (canEdit) {
  // do something
}
```

### 4. Role-Based Rendering

```tsx
import { RoleGate } from '@/features/auth'

<RoleGate roles={['admin']}>
  <AdminPanel />
</RoleGate>
```

### 5. Multiple Permissions (ANY)

```tsx
<Can permissions={['users:edit', 'users:delete']}>
  <button>Manage</button>
</Can>
```

### 6. Multiple Permissions (ALL)

```tsx
<Can permissions={['users:edit', 'users:delete']} requireAll>
  <button>Full Access</button>
</Can>
```

### 7. With Fallback

```tsx
<Can permission="users:edit" fallback={<p>No access</p>}>
  <button>Edit</button>
</Can>
```

### 8. Get Current User

```tsx
import { useAuth } from '@/features/auth'

const { user, isAuthenticated, login, logout } = useAuth()
```

## Permission Naming Convention

```
resource:action
```

Examples:
- `users:view`
- `users:create`
- `users:edit`
- `users:delete`
- `products:view`
- `settings:edit`

## Default Roles

| Role | Access Level |
|------|--------------|
| admin | Full access to everything |
| user | Limited access (view only) |
| guest | Minimal access (public only) |

## Adding New Permissions

1. Add to `types/auth.ts`:
```typescript
type Permission =
  | 'existing:permissions'
  | 'new:permission'  // Add here
```

2. Assign to roles in `lib/permissions/roles.ts`:
```typescript
export const ROLE_PERMISSIONS = {
  admin: ['new:permission'],
  user: [],
  guest: []
}
```

3. Use it:
```tsx
<Can permission="new:permission">
  <NewFeature />
</Can>
```

## Testing Different Roles

Visit `/login` and select:
- **Admin** - Full access
- **User** - Limited access

## Key Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `<Can>` | Show/hide based on permission | permission, permissions, requireAll, fallback |
| `<RoleGate>` | Show/hide based on role | roles, fallback |
| `<ProtectedRoute>` | Protect entire page | permissions, requireAll, redirectTo |

## Key Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useAuth()` | Get auth state | user, isAuthenticated, login, logout, etc. |
| `usePermission()` | Check single permission | boolean |
| `useAnyPermission()` | Check if has any permission | boolean |
| `useAllPermissions()` | Check if has all permissions | boolean |
| `useRole()` | Check user role | boolean |

## File Locations

```
types/auth.ts                              # Permission types
lib/permissions/roles.ts                   # Role definitions
lib/permissions/routes.ts                  # Route permissions
features/auth/context/auth-context.tsx     # Auth provider
features/auth/components/can.tsx           # Permission component
features/auth/components/protected-route.tsx # Route protection
middleware.ts                              # Server middleware
```

## Common Patterns

### Admin-Only Feature
```tsx
<RoleGate roles={['admin']}>
  <AdminFeature />
</RoleGate>
```

### Edit Button for Admins Only
```tsx
<Can permission="users:edit">
  <Button>Edit</Button>
</Can>
```

### Protected Page with Multiple Permissions
```tsx
<ProtectedRoute permissions={['users:view', 'users:edit']} requireAll>
  <AdminPage />
</ProtectedRoute>
```

### Conditional Component
```tsx
const canDelete = usePermission('users:delete')

return canDelete ? <DeleteButton /> : <DisabledButton />
```

## Best Practices

1. ✅ Always protect sensitive routes with `<ProtectedRoute>`
2. ✅ Use specific permissions (`users:edit`) not broad ones
3. ✅ Validate permissions on the server side too
4. ✅ Provide fallback messages when access denied
5. ✅ Follow naming convention: `resource:action`
6. ❌ Don't rely solely on client-side protection
7. ❌ Don't use role checks when permissions are more appropriate

## Need More Details?

See [RBAC.md](./RBAC.md) for comprehensive documentation.

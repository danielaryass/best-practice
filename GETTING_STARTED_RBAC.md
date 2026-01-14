# Getting Started with RBAC

This guide will help you quickly understand and use the role-based access control system.

## Quick Demo

1. **Start the development server:**
```bash
npm run dev
```

2. **Visit the login page:**
```
http://localhost:3000/login
```

3. **Try different roles:**
   - Login as **Admin** - See all features
   - Login as **User** - See limited features

4. **Navigate to protected pages:**
   - `/dashboard` - Main dashboard (requires authentication)
   - `/users` - User management (admin only)
   - `/settings` - Settings page (permission-based)

## What You'll See

### As Admin
- Full access to all pages
- All buttons and actions visible
- Can create, edit, and delete users
- Can modify settings

### As User
- Limited access
- Can view dashboard
- Cannot see admin-only sections
- Most action buttons hidden
- View-only access to most features

## How It Works

### 1. Login System
The login page (`/app/(auth)/login/page.tsx`) allows you to select a role:

```tsx
// This is a demo login - replace with real authentication
const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin', // or 'user'
}

login(mockUser)
```

### 2. Protected Pages
Pages are automatically protected:

```tsx
// app/(dashboard)/users/page.tsx
<ProtectedRoute permissions={['users:view']}>
  <YourContent />
</ProtectedRoute>
```

### 3. Conditional Buttons
Buttons show/hide based on permissions:

```tsx
<Can permission="users:create">
  <button>Create User</button>
</Can>
```

## Common Scenarios

### Scenario 1: Protect a New Page

```tsx
// app/(dashboard)/products/page.tsx
import { ProtectedRoute } from '@/features/auth'

export default function ProductsPage() {
  return (
    <ProtectedRoute permissions={['products:view']}>
      <div>Products content</div>
    </ProtectedRoute>
  )
}
```

**Don't forget to:**
1. Add permission to `types/auth.ts`
2. Assign to roles in `lib/permissions/roles.ts`
3. Add route to `lib/permissions/routes.ts` (optional)

### Scenario 2: Hide a Button from Users

```tsx
import { Can } from '@/features/auth'

<Can permission="users:delete">
  <button>Delete User</button>
</Can>
```

### Scenario 3: Check Permission in Function

```tsx
import { usePermission } from '@/features/auth'

function MyComponent() {
  const canEdit = usePermission('users:edit')

  const handleClick = () => {
    if (!canEdit) {
      alert('You do not have permission')
      return
    }
    // Proceed with edit
  }

  return <button onClick={handleClick}>Edit</button>
}
```

### Scenario 4: Admin-Only Section

```tsx
import { RoleGate } from '@/features/auth'

<RoleGate roles={['admin']}>
  <AdminPanel />
</RoleGate>
```

## File Structure

```
my-app/
├── types/
│   └── auth.ts                    # Permission definitions
├── lib/
│   └── permissions/
│       ├── roles.ts               # Role → Permission mapping
│       └── routes.ts              # Route → Permission mapping
├── features/
│   └── auth/
│       ├── context/               # Auth state management
│       ├── components/            # Can, ProtectedRoute, RoleGate
│       └── hooks/                 # usePermission, useAuth
├── app/
│   ├── (auth)/
│   │   └── login/                 # Login page
│   └── (dashboard)/
│       ├── dashboard/             # Protected dashboard
│       ├── users/                 # Admin-only page
│       └── settings/              # Permission-based page
└── middleware.ts                   # Server-side protection
```

## Adding a New Permission

### Step 1: Define Permission
```typescript
// types/auth.ts
type Permission =
  | 'existing:permissions'
  | 'orders:create'  // New permission
```

### Step 2: Assign to Roles
```typescript
// lib/permissions/roles.ts
export const ROLE_PERMISSIONS = {
  admin: ['users:view', 'orders:create'],
  user: ['orders:create'],  // Users can also create orders
  guest: [],
}
```

### Step 3: Use It
```tsx
<Can permission="orders:create">
  <button>Create Order</button>
</Can>
```

## Common Patterns

### Pattern 1: Multiple Permissions (OR)
```tsx
// Show if user has users:edit OR users:delete
<Can permissions={['users:edit', 'users:delete']}>
  <button>Manage User</button>
</Can>
```

### Pattern 2: Multiple Permissions (AND)
```tsx
// Show only if user has BOTH permissions
<Can permissions={['users:edit', 'users:delete']} requireAll>
  <button>Full Access</button>
</Can>
```

### Pattern 3: With Fallback Message
```tsx
<Can
  permission="users:delete"
  fallback={<p>You don't have permission to delete</p>}
>
  <button>Delete</button>
</Can>
```

### Pattern 4: Dynamic Permission Check
```tsx
function ResourceButton({ resource, action }) {
  const permission = `${resource}:${action}` as Permission
  const hasAccess = usePermission(permission)

  return hasAccess ? <button>Action</button> : null
}

// Usage
<ResourceButton resource="users" action="edit" />
```

## Available Components & Hooks

### Components
- `<Can>` - Show/hide based on permission
- `<RoleGate>` - Show/hide based on role
- `<ProtectedRoute>` - Protect entire page

### Hooks
- `useAuth()` - Get user, login, logout
- `usePermission()` - Check single permission
- `useAnyPermission()` - Check if has any permission
- `useAllPermissions()` - Check if has all permissions
- `useRole()` - Check user role

## Testing the System

1. **Login as Admin**
   - Go to `/login`
   - Select "Admin"
   - Click "Login as admin"
   - See all features enabled

2. **Login as User**
   - Logout
   - Go to `/login`
   - Select "User"
   - Click "Login as user"
   - Notice limited features

3. **Try Protected Pages**
   - Visit `/users` as User → Should redirect or show access denied
   - Visit `/users` as Admin → Full access

4. **Check Button Visibility**
   - Dashboard page shows different buttons for different roles
   - Users page shows "Create User" only to admins

## Next Steps

1. **Integrate Real Authentication**
   - Replace mock login with real API
   - Store JWT tokens
   - Validate on server

2. **Add More Permissions**
   - Define your app's specific permissions
   - Follow the `resource:action` pattern

3. **Protect API Routes**
   - Add permission checks to API endpoints
   - Validate JWT tokens
   - Return 403 for unauthorized access

4. **Customize Roles**
   - Modify role permissions in `lib/permissions/roles.ts`
   - Add new roles if needed

## Production Checklist

- [ ] Replace mock authentication with real auth
- [ ] Implement server-side token validation
- [ ] Add API route protection
- [ ] Test all permission scenarios
- [ ] Add error boundaries
- [ ] Implement proper session management
- [ ] Add audit logging
- [ ] Set up role management UI (for admins)

## Need Help?

- **Quick Reference:** See [RBAC_QUICK_REFERENCE.md](./RBAC_QUICK_REFERENCE.md)
- **Full Documentation:** See [RBAC.md](./RBAC.md)
- **Code Examples:** See [EXAMPLES.md](./EXAMPLES.md)

## Common Issues

### Issue: "useAuth must be used within AuthProvider"
**Solution:** Make sure `AuthProvider` is in your `app/providers.tsx`

### Issue: Permissions not working
**Solution:** Check that permission is defined in `types/auth.ts` and assigned in `lib/permissions/roles.ts`

### Issue: Page redirects to login
**Solution:** User is not authenticated. Login first via `/login`

### Issue: Can see route but not content
**Solution:** Page route is protected by middleware but component has additional permission checks

---

**Happy coding!** 🚀

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth, Can, RoleGate } from '@/features/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} ({user?.role})
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card visible to all authenticated users */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Email: {user?.email}</p>
            <p className="text-sm">Role: {user?.role}</p>
          </CardContent>
        </Card>

        {/* Admin-only card using RoleGate */}
        <RoleGate
          roles={['admin']}
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Admin access required
                </p>
              </CardContent>
            </Card>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Manage Users</Button>
              <Button className="w-full" variant="outline">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </RoleGate>

        {/* Card with permission-based buttons */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Can permission="users:view">
              <Button className="w-full" variant="outline">
                View Users
              </Button>
            </Can>

            <Can permission="users:create">
              <Button className="w-full">Create User</Button>
            </Can>

            <Can permission="users:edit">
              <Button className="w-full" variant="outline">
                Edit Users
              </Button>
            </Can>

            <Can
              permission="users:delete"
              fallback={
                <p className="text-sm text-muted-foreground">
                  Delete permission required
                </p>
              }
            >
              <Button className="w-full" variant="destructive">
                Delete Users
              </Button>
            </Can>
          </CardContent>
        </Card>

        {/* Card with multiple permission checks */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Can permission="products:view">
              <Button className="w-full" variant="outline">
                View Products
              </Button>
            </Can>

            <Can permissions={['products:create', 'products:edit']}>
              <Button className="w-full">Manage Products</Button>
            </Can>

            <Can
              permissions={['products:edit', 'products:delete']}
              requireAll
              fallback={
                <p className="text-sm text-muted-foreground">
                  Full product management access required
                </p>
              }
            >
              <Button className="w-full" variant="destructive">
                Full Product Access
              </Button>
            </Can>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

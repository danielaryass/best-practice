'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth'
import { User } from '@/types/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user')

  const handleLogin = (role: 'admin' | 'user') => {
    // Mock user data - in production, this would come from your API
    const mockUser: User = {
      id: Math.random().toString(),
      name: role === 'admin' ? 'Admin User' : 'Regular User',
      email: email || `${role}@example.com`,
      role: role,
    }

    login(mockUser)

    // Redirect to the page they were trying to access, or dashboard
    const redirect = searchParams.get('redirect') || '/dashboard'
    router.push(redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Demo: Select a role to login
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Role</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={selectedRole === 'admin' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('admin')}
                className="flex-1"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'user' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('user')}
                className="flex-1"
              >
                User
              </Button>
            </div>
          </div>

          <Button
            onClick={() => handleLogin(selectedRole)}
            className="w-full"
          >
            Login as {selectedRole}
          </Button>

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Admin</strong> - Full access to all features</p>
            <p><strong>User</strong> - Limited access (view only)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

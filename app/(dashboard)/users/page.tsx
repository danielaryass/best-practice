'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateUserForm, UserList } from '@/features/users'
import { ProtectedRoute, Can } from '@/features/auth'

export default function UsersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <ProtectedRoute permissions={['users:view']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">
              Manage your users and their roles
            </p>
          </div>
          <Can permission="users:create">
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'View Users' : 'Create User'}
            </Button>
          </Can>
        </div>

        {showCreateForm ? (
          <CreateUserForm
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <UserList />
        )}
      </div>
    </ProtectedRoute>
  )
}

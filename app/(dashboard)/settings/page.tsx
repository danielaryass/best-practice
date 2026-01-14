'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute, Can } from '@/features/auth'

export default function SettingsPage() {
  return (
    <ProtectedRoute permissions={['settings:view']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Application Name</p>
              <p className="text-sm text-muted-foreground">My Application</p>
            </div>

            <Can
              permission="settings:edit"
              fallback={
                <p className="text-sm text-yellow-600">
                  You can only view settings. Edit permission required.
                </p>
              }
            >
              <Button>Edit Settings</Button>
            </Can>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Can
              permission="settings:edit"
              fallback={
                <p className="text-sm text-muted-foreground">
                  Edit permission required to view advanced settings
                </p>
              }
            >
              <div className="space-y-2">
                <p className="text-sm">Database Configuration</p>
                <p className="text-sm">API Keys</p>
                <p className="text-sm">Email Settings</p>
                <Button className="mt-4">Save Changes</Button>
              </div>
            </Can>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

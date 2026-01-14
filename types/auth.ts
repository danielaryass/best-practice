export type UserRole = 'admin' | 'user' | 'guest'

export type Permission =
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

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions?: Permission[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

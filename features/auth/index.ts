// Export everything from auth feature
export { AuthProvider, useAuth } from './context/auth-context'
export { Can } from './components/can'
export { ProtectedRoute } from './components/protected-route'
export { RoleGate } from './components/role-gate'
export {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
} from './hooks/use-permission'

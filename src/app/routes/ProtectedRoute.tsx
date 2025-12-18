import { useAuth } from '@/shared/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

export const ProtectedRoute = () => {
   const { isAuthenticated, isLoading } = useAuth()

   if (isLoading || isAuthenticated === null) return null

   if (isAuthenticated === false) return <Navigate to="/auth" replace />

   return <Outlet />
}

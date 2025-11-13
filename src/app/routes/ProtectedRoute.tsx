import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

export const ProtectedRoute = () => {
   const { isAuthenticated, isLoading } = useAuth()

   if (isLoading) {
      return null
   }

   if (!isAuthenticated) {
      return <Navigate to="/auth" replace />
   }

   return <Outlet />
}

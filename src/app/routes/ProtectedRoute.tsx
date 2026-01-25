import { useAuth } from '@/shared/hooks/use-auth'
import { Navigate, Outlet, useLocation } from 'react-router'

export const ProtectedRoute = () => {
   const { isLoading, isAuthenticated } = useAuth()
   const location = useLocation()

   if (isLoading) return null

   if (!isAuthenticated) {
      return <Navigate to="/auth" replace state={{ from: location }} />
   }

   return <Outlet />
}

import { Navigate, Outlet } from 'react-router'

export const ProtectedRoute = () => {
   const isAuth = false

   if (!isAuth) {
      return <Navigate to="/login" replace />
   }

   return <Outlet />
}

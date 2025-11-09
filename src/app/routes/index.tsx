import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export const AppRouter = () => (
   <Suspense fallback={<div className="flex h-screen items-center justify-center">Загрузка...</div>}>
      <RouterProvider router={router} />
   </Suspense>
)
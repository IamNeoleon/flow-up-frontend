import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export const AppRouter = () => (
   <RouterProvider router={router} />
)
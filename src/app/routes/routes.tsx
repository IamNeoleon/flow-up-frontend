import { lazy } from 'react'
import type { RouteObject } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { WorkspaceInvitePage } from '@/pages/WorkspaceInvitePage'
import { BoardPage } from '@/pages/BoardPage'

// Lazy pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))

export const routes: RouteObject[] = [
   {
      path: '/auth',
      element: <AuthPage />,
   },
   {
      element: <ProtectedRoute />,
      children: [
         {
            path: '/',
            element: <MainLayout />,
            children: [
               { index: true, element: <HomePage /> },
               { path: '*', element: <NotFoundPage /> },
               { path: '/workspace/:id', element: <WorkspacePage /> },
               { path: '/invite/:token', element: <WorkspaceInvitePage /> },
               { path: '/board/:boardId', element: <BoardPage /> }
            ],
         },
      ],
   },
]

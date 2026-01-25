import { lazy } from 'react'
import type { RouteObject } from 'react-router'
import { MainLayout } from '@/app/layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '../layouts/AppShell'

// Lazy pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const WorkspacePage = lazy(() => import('@/pages/WorkspacePage'))
const WorkspaceInvitePage = lazy(() => import('@/pages/WorkspaceInvitePage'))
const BoardPage = lazy(() => import('@/pages/BoardPage'))
const AuthCallback = lazy(() => import('@/pages/AuthCallback'))

export const routes: RouteObject[] = [
   {
      element: <AppShell />,
      children: [
         {
            path: '/auth',
            element: <AuthPage />,
         },
         {
            path: '/auth/callback',
            element: <AuthCallback />
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
                     { path: '/workspaces/:workspaceId', element: <WorkspacePage /> },
                     { path: '/workspaces/invite/:token', element: <WorkspaceInvitePage /> },
                     { path: '/workspaces/:workspaceId/boards/:boardId', element: <BoardPage /> }
                  ],
               },
            ],
         },
      ]
   }

]

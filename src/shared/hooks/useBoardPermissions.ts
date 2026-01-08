import { ROLE_PERMISSIONS } from '@/shared/constants/board.permissions'
import type { TBoardRole } from '@/shared/constants/board.permissions'
import { useWorkspaceRole } from './useWorkspaceRole'
import { useGetMyBoardRoleQuery } from '@/api/endpoints/boardApi'

export const useBoardPermissions = (
   workspaceId: string,
   boardId: string,
   userId: string
) => {
   const { data: boardRole } = useGetMyBoardRoleQuery({ workspaceId, boardId })
   const workspaceRole = useWorkspaceRole(workspaceId, userId)

   let effectiveRole: TBoardRole = 'VIEWER'

   if (workspaceRole === 'OWNER') {
      effectiveRole = 'OWNER'
   } else if (boardRole) {
      effectiveRole = boardRole
   }

   return {
      role: effectiveRole,
      permissions: ROLE_PERMISSIONS[effectiveRole],
   }
}

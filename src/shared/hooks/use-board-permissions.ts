import { ROLE_PERMISSIONS } from '@/features/board/constants/board-permissions'
import type { TBoardRole } from '@/features/board/types/board-role'
import { useWorkspaceRole } from './use-workspace-role'
import { useGetMyBoardRoleQuery } from '@/features/board/api/boardApi'

export const useBoardPermissions = (
   workspaceId: string,
   boardId: string,
   userId: string
) => {
   const { data: boardRole } = useGetMyBoardRoleQuery({ workspaceId, boardId })
   const workspaceRole = useWorkspaceRole(workspaceId, userId)

   console.log(boardRole);


   let effectiveRole: TBoardRole = 'VIEWER'

   if (workspaceRole === 'OWNER') {
      effectiveRole = 'OWNER'
   } else if (boardRole) {
      effectiveRole = boardRole.role
   }

   console.log(effectiveRole);


   return {
      role: effectiveRole,
      permissions: ROLE_PERMISSIONS[effectiveRole],
   }
}

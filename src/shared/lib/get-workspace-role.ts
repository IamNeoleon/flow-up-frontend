import type { TWorkspaceRole } from "@/features/workspace/types/workspace-role"

export const getWorkspaceRole = (role: TWorkspaceRole) => {
   const map: Record<TWorkspaceRole, string> = {
      OWNER: 'Владелец',
      EDITOR: 'Администратор',
      MEMBER: 'Участник',
   }

   return map[role]
}
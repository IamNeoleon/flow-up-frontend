import type { TWorkspaceRole } from "../types/workspace.types"

export const getWorkspaceRole = (role: TWorkspaceRole) => {
   const map: Record<TWorkspaceRole, string> = {
      OWNER: 'Владелец',
      EDITOR: 'Администратор',
      MEMBER: 'Участник',
   }

   return map[role]
}
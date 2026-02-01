import type { TWorkspaceRole } from "@/services/workspace/types/workspace-role"
import i18n from "i18next"

export const getWorkspaceRole = (role: TWorkspaceRole) => {
   const map: Record<TWorkspaceRole, string> = {
      OWNER: "role.owner",
      EDITOR: "role.admin",
      MEMBER: "role.member",
   }

   return i18n.t(map[role])
}

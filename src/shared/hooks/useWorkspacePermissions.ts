import { useGetMyWorkspaceRoleQuery } from "@/api/endpoints/workspaceApi"
import { ROLE_PERMISSIONS } from "../constants/workspace.permissions"
import type { TWorkspaceRole } from "../types/workspace.types"
import { skipToken } from "@reduxjs/toolkit/query"

export const useWorkspacePermissions = (workspaceId: string | undefined) => {
   const { data: role } = useGetMyWorkspaceRoleQuery(workspaceId ?? skipToken)
   let effectiveRole: TWorkspaceRole = 'MEMBER'

   if (role) {
      effectiveRole = role
   }

   return {
      role: effectiveRole,
      permissions: ROLE_PERMISSIONS[effectiveRole]
   }
}
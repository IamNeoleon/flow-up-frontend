import type { IWorkspacePermission } from "../types/workspace-permission";
import type { TWorkspaceRole } from "../types/workspace-role";

export const WORKSPACE_ROLE_PERMISSIONS: Record<TWorkspaceRole, IWorkspacePermission> = {
   OWNER: {
      canCreateBoard: true,
      canDeleteBoard: true,
      canInviteMember: true,
      canDeleteMember: true,
      canChangeRole: true,
      canEditWorkspace: true,
      canDeleteWorkspace: true
   },
   EDITOR: {
      canCreateBoard: true,
      canDeleteBoard: false,
      canInviteMember: true,
      canDeleteMember: false,
      canChangeRole: false,
      canEditWorkspace: true,
      canDeleteWorkspace: false
   },
   MEMBER: {
      canCreateBoard: false,
      canDeleteBoard: false,
      canInviteMember: false,
      canDeleteMember: false,
      canChangeRole: false,
      canEditWorkspace: false,
      canDeleteWorkspace: false
   }
} as const
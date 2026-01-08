export type TWorkspaceRole = 'OWNER' | 'EDITOR' | 'MEMBER'

export interface IWorkspacePermission {
   canCreateBoard: boolean,
   canDeleteBoard: boolean,
   canInviteMember: boolean,
   canDeleteMember: boolean,
   canChangeRole: boolean,
   canEditWorkspace: boolean,
   canDeleteWorkspace: boolean
}

export const ROLE_PERMISSIONS: Record<TWorkspaceRole, IWorkspacePermission> = {
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
      canDeleteMember: true,
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
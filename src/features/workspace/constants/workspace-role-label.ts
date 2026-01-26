import type { TWorkspaceRole } from "../types/workspace-role";

export const WORKSPACE_ROLE_LABEL: Record<TWorkspaceRole, string> = {
   OWNER: "workspaceRole.owner",
   EDITOR: "workspaceRole.editor",
   MEMBER: "workspaceRole.member",
} as const

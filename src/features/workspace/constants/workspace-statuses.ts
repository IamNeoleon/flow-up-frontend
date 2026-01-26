import { type TWorkspaceStatus } from "../types/workspace-status";

export const WORKSPACE_STATUSES: Record<TWorkspaceStatus, string> = {
   ACTIVE: "workspace.status.active",
   ARCHIVED: "workspace.status.archived",
} as const;

import { type TWorkspaceStatus } from "../types/workspace-status";

export const WORKSPACE_STATUSES: Record<TWorkspaceStatus, string> = {
   ACTIVE: 'Активен',
   ARCHIVED: 'Архивирован',
} as const;
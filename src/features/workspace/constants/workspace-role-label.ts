import type { TWorkspaceRole } from "../types/workspace-role";

export const WORKSPACE_ROLE_LABEL: Record<TWorkspaceRole, string> = {
   OWNER: 'Владелец',
   EDITOR: 'Редактор',
   MEMBER: 'Наблюдатель',
} as const
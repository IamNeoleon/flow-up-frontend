import type { TBoardRole } from "../types/board-role";

export const BOARD_MEMBER_STATUS_LABELS: Record<TBoardRole, string> = {
   OWNER: "boardRole.owner",
   EDITOR: "boardRole.editor",
   VIEWER: "boardRole.viewer"
} as const

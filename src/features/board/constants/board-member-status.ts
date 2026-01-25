import type { TBoardRole } from "../types/board-role";

export const BOARD_MEMBER_STATUS_LABELS: Record<TBoardRole, string> = {
   OWNER: 'Владелец',
   EDITOR: "Редактор",
   VIEWER: "Участник"
} as const
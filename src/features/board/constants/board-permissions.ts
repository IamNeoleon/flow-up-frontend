import type { IBoardPermissions } from "../types/board-permissions";
import type { TBoardRole } from "../types/board-role";

export const ROLE_PERMISSIONS: Record<TBoardRole, IBoardPermissions> = {
   OWNER: {
      canEditBoard: true,
      canDeleteBoard: true,
      canCreateColumn: true,
      canDeleteColumn: true,
      canUpdateColumn: true,
      canMoveColumn: true,
      canCreateTask: true,
      canUpdateTask: true,
      canMoveTask: true,
      canDeleteTask: true,
      canChangeRole: true
   },
   EDITOR: {
      canEditBoard: true,
      canDeleteBoard: false,
      canCreateColumn: true,
      canDeleteColumn: true,
      canUpdateColumn: true,
      canMoveColumn: true,
      canCreateTask: true,
      canUpdateTask: true,
      canMoveTask: true,
      canDeleteTask: true,
      canChangeRole: false
   },
   VIEWER: {
      canEditBoard: false,
      canDeleteBoard: false,
      canCreateColumn: false,
      canDeleteColumn: false,
      canUpdateColumn: false,
      canMoveColumn: false,
      canCreateTask: false,
      canUpdateTask: false,
      canMoveTask: false,
      canDeleteTask: false,
      canChangeRole: false
   },
} as const
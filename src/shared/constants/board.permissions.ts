export type TBoardRole = 'OWNER' | 'EDITOR' | 'VIEWER'

export interface IBoardPermissions {
   canEditBoard: boolean,
   canDeleteBoard: boolean,
   canCreateColumn: boolean,
   canDeleteColumn: boolean,
   canUpdateColumn: boolean,
   canMoveColumn: boolean,
   canCreateTask: boolean,
   canUpdateTask: boolean,
   canMoveTask: boolean,
   canDeleteTask: boolean
}

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
      canDeleteTask: true
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
      canDeleteTask: true
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
      canDeleteTask: false
   }
} as const
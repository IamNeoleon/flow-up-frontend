export interface IBoardEvents {
   BOARD_UPDATED: {
      boardId: string
   }
   TASK_CREATED: {
      boardId: string
      colId: string
      actorId: string
   }
   TASK_UPDATED: {
      boardId: string
      colId: string
      taskId: string
      actorId: string
   }
   TASK_DELETED: {
      boardId: string
      colId: string
      actorId: string
   }
   JOIN_BOARD_ROOM: {
      boardId: string
   }
   TASK_COMMENTED: {
      boardId: string
      colId: string
      actorId: string,
      taskId: string
   }
}

export type BoardEventKey = keyof IBoardEvents

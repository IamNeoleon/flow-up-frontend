export const taskRoutes = {
   root: (boardId: string, colId: string) =>
      `/boards/${boardId}/columns/${colId}/tasks`,

   byId: (boardId: string, colId: string, taskId: string) =>
      `/boards/${boardId}/columns/${colId}/tasks/${taskId}`,

   move: (boardId: string, colId: string, taskId: string) =>
      `/boards/${boardId}/columns/${colId}/tasks/${taskId}/move`,
} as const

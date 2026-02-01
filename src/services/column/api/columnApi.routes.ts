export const columnRoutes = {
   root: (boardId: string) =>
      `/boards/${boardId}/columns`,

   byId: (boardId: string, colId: string) =>
      `/boards/${boardId}/columns/${colId}`,

   changeOrder: (boardId: string, colId: string) =>
      `/boards/${boardId}/columns/${colId}/change-order`,
} as const

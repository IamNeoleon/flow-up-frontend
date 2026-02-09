export const routes = {
   home: () => "/",
   workspaces: () => "/workspaces",
   workspace: (args: { workspaceId: string }) => `/workspaces/${args.workspaceId}`,
   workspaceStatistics: (args: { workspaceId: string }) => `/workspaces/${args.workspaceId}/statistics`,
   board: (args: { workspaceId: string, boardId: string }) =>
      `/workspaces/${args.workspaceId}/boards/${args.boardId}`,
   task: (args: { workspaceId: string, boardId: string, colId: string, taskId: string }) =>
      `/workspaces/${args.workspaceId}/boards/${args.boardId}/${args.colId}/tasks/${args.taskId}`,
} as const;
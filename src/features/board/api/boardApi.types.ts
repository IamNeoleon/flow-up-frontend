export interface IBoardParams {
   workspaceId: string
   boardId: string
}

export interface ICreateBoardArgs {
   workspaceId: string,
   name: string,
   description: string
}

export interface IEditBoardArgs {
   workspaceId: string,
   boardId: string,
   name: string,
   description: string
}
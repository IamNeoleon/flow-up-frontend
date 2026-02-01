import type { TColumnStatus } from "../types/column-status";

export interface ICreateColumnArgs {
   boardId: string,
   name: string,
   color?: string,
   status: TColumnStatus
}

export interface IEditColumnArgs {
   boardId: string,
   colId: string,
   name: string,
   status: TColumnStatus,
   color?: string
}

export interface IDeleteColumnArgs {
   boardId: string,
   colId: string,
}

export interface IChangeOrderColumnArgs {
   boardId: string,
   colId: string,
   newOrder: number,
   activeId: string,
   overId: string
}

import type { ITask } from "./task.types"

export interface IColumn {
   id: string
   name: string
   order: number
   boardId: string
   tasks: ITask[]
}
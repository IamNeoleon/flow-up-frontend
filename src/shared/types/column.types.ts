import type { ITaskPreview } from "./task.types"

export interface IColumn {
   id: string
   name: string
   order: number
   boardId: string
   color?: string
   tasks: ITaskPreview[]
}
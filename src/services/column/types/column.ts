import type { TColumnStatus } from "./column-status"
import type { ITaskPreview } from "@/services/tasks/types/task-preview"

export interface IColumn {
   id: string
   name: string
   order: number
   boardId: string
   status: TColumnStatus
   color?: string
   tasks: ITaskPreview[]
}
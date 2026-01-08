import type { TColumnStatus } from "@/features/column/types"
import type { ITaskPreview } from "./task.types"

export interface IColumn {
   id: string
   name: string
   order: number
   boardId: string
   status: TColumnStatus
   color?: string
   tasks: ITaskPreview[]
}
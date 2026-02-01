import type { IBoard } from "@/services/board/types/board"
import type { TWorkspaceIcon } from "./workspace-icon"

export interface IWorkspace {
   id: string
   name: string
   isArchived: boolean
   icon: TWorkspaceIcon | null
   description?: string
   ownerId: string
   boards: IBoard[]
}
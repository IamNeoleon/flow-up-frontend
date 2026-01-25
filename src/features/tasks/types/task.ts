import type { IUser } from "@/features/user/types/user"
import type { ITaskPriority } from "./task-priority"
import type { ITaskTodo } from "./task-todo"
import type { ITaskAttachment } from "./task-attachments"

export interface ITask {
   id: string,
   name: string,
   colId: string,
   description?: string,
   assigneeId?: string
   assignee: Pick<IUser, 'id' | 'username' | 'avatar'> | null,
   order: number
   priorityId?: string
   priority?: ITaskPriority
   todos: ITaskTodo[]
   attachments: ITaskAttachment[]
   dueDate?: string
   createdAt: string
   updatedAt: string
}
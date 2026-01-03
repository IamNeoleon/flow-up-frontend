export interface ITask {
   id: string,
   name: string,
   colId: string,
   description?: string,
   assigneeId?: string
   order: number
   priorityId?: string
   priority?: ITaskPriority
   todos: ITaskTodo[]
   attachments?: number
   dueDate?: string
   createdAt: string
   updatedAt: string
}

export type ITaskPreview = Pick<ITask, 'id' | 'name' | 'priority' | 'colId'>;

export interface ITaskTodo {
   id: string,
   title: string,
   completed: boolean,
   taskId: string,
   createdAt: string
}

export interface ITaskPriority {
   id: string,
   name: string,
   color: string,
   weight: number
}


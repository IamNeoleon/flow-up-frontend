export type TTaskPriorityName = 'Critical' | 'High' | 'Medium' | 'Low'

export interface ITaskPriority {
   id: string,
   name: TTaskPriorityName,
   color: string,
   weight: number
}
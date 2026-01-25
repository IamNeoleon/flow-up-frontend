import type { ITask } from "./task";

export type ITaskPreview = Pick<ITask, 'id' | 'name' | 'priority' | 'colId'>;
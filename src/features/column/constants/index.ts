import type { TColumnStatus } from "../types";

export const TASK_STATUS_LABELS: Record<TColumnStatus, string> = {
   TODO: 'Не начато',
   IN_PROGRESS: 'В работе',
   DONE: 'Готово'
}
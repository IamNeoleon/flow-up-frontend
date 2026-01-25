import type { TColumnStatus } from "../types/column-status";

export const COLUMN_STATUS_LABELS: Record<TColumnStatus, string> = {
   TODO: 'Не начато',
   IN_PROGRESS: 'В работе',
   DONE: 'Готово'
}
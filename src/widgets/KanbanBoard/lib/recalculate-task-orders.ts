import type { ITaskPreview } from "@/services/tasks/types/task-preview";
import { useCallback } from "react";

export const recalculateTaskOrders = useCallback((allTasks: ITaskPreview[], affectedColIds: string[]) => {
   const result = [...allTasks];
   affectedColIds.forEach((colId) => {
      const colTasksWithIndices = result
         .map((task, index) => ({ task, index }))
         .filter(({ task }) => task.colId === colId);
      colTasksWithIndices.forEach(({ index }, position) => {
         result[index] = { ...result[index], order: position + 1 };
      });
   });
   return result;
}, []);

import type { IColumn } from "@/shared/types/column.types";

export const moveTask = (taskId: string, targetColId: string, columns: IColumn[]) => {
   const fromCol = columns.find(col =>
      col.tasks.some(task => task.id === taskId)
   );
   const toCol = columns.find(col => col.id === targetColId);

   if (!fromCol || !toCol) return;
   if (fromCol.id === toCol.id) return;

   const taskIndex = fromCol.tasks.findIndex(task => task.id === taskId);
   if (taskIndex === -1) return;

   const [task] = fromCol.tasks.splice(taskIndex, 1);
   toCol.tasks.push(task);
}
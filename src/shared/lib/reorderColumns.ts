import type { IColumn } from "@/shared/types/column.types";

export const reorderColumns = (
   columns: IColumn[],
   activeId: string,
   overId: string
) => {
   const oldCol = columns.find(col => col.id === activeId);
   const newCol = columns.find(col => col.id === overId);

   if (!oldCol || !newCol) return;

   const oldOrder = oldCol.order;
   const newOrder = newCol.order;

   oldCol.order = newOrder;

   columns.forEach(col => {
      if (col.id === oldCol.id) return;

      // движение вправо
      if (oldOrder < newOrder) {
         if (col.order > oldOrder && col.order <= newOrder) {
            col.order -= 1;
         }
      }

      // движение влево
      if (oldOrder > newOrder) {
         if (col.order < oldOrder && col.order >= newOrder) {
            col.order += 1;
         }
      }
   });
};
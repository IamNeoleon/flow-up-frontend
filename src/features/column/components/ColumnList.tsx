import { useMoveTaskMutation } from "@/api/endpoints/taskApi";
import type { IColumn } from "@/shared/types/column.types";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useMemo } from "react";
import { Column } from "./Column";
import { TaskList } from "@/features/tasks/components/TaskList";
import { useChangeOrderMutation, useGetAllColumnsQuery } from "@/api/endpoints/columnApi";

interface IColumnListProps {
   boardId: string
}

export const ColumnList = ({ boardId }: IColumnListProps) => {
   const { data: columns, isLoading, isError, isSuccess } = useGetAllColumnsQuery(boardId)
   const [updateTask] = useMoveTaskMutation()
   const [changeOrder] = useChangeOrderMutation()
   const sortedColumns = useMemo(() => {
      if (!columns) return [];
      return [...columns].sort((a, b) => a.order - b.order);
   }, [columns]);

   const handleDragEnd = async (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over) return;

      const activeType: string = active.data.current?.type
      const overType: string = over.data.current?.type
      const overCol = columns?.find(item => item.id === over.id)

      if (!overCol) return

      if (activeType === 'task' && overType === 'column') {
         const oldCol = columns?.find(col => col.tasks.find(task => task.id === active.id));
         if (!oldCol) return

         updateTask({
            colId: oldCol.id,
            targetColId: over.id as string,
            taskId: active.id as string,
            boardId: overCol.boardId
         })

         return;
      }

      if (activeType === 'column' && overType === 'column') {
         changeOrder({
            boardId,
            colId: active.id as string,
            newOrder: overCol.order,
            activeId: active.id as string,
            overId: over.id as string
         })
      }
   }

   return (
      <>
         <div className="grid grid-cols-4 gap-10">
            <DndContext onDragEnd={handleDragEnd}>
               {
                  sortedColumns?.map((column) => (
                     <Column key={column.id} column={column}>
                        <TaskList tasks={column.tasks} colId={column.id} color={column.color ? column.color : '#3c3c3c'} />
                     </Column>
                  ))
               }
            </DndContext>
         </div>
      </>
   );
};

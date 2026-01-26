import { useMemo } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useMoveTaskMutation } from "@/features/tasks/api/taskApi";
import { TaskList } from "@/features/tasks/components/TaskList";
import { useChangeOrderMutation, useGetAllColumnsQuery } from "../api/columnApi";
import { ColumnSkeleton } from "./ColumnSkeleton";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { Column } from "./Column";
import { useTranslation } from "react-i18next";

interface IColumnListProps {
   boardId: string
}

export const ColumnList = ({ boardId }: IColumnListProps) => {
   const { t } = useTranslation()
   const { data: columns, isLoading, isError, error } = useGetAllColumnsQuery(boardId)
   const [moveTask] = useMoveTaskMutation()
   const [changeOrderCol] = useChangeOrderMutation()
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

         try {
            moveTask({
               colId: oldCol.id,
               targetColId: over.id as string,
               taskId: active.id as string,
               boardId: overCol.boardId
            }).unwrap()
         } catch (error) {
            toast.error(t("column.moveTaskError"))
         }
         return;
      }

      if (activeType === 'column' && overType === 'column') {
         try {
            changeOrderCol({
               boardId,
               colId: active.id as string,
               newOrder: overCol.order,
               activeId: active.id as string,
               overId: over.id as string
            }).unwrap()
         } catch (error) {
            toast.error(t("column.moveColumnError"))
         }
      }
   }

   return (
      <>
         <div style={{ display: isError ? 'block' : 'grid' }} className={clsx("grid grid-cols-4 gap-10 items-start")}>
            {
               isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                     <ColumnSkeleton key={index} />
                  ))
               ) : (
                  !isError ? (
                     <DndContext onDragEnd={handleDragEnd}>
                        {
                           sortedColumns?.map((column) => (
                              <Column key={column.id} column={column}>
                                 <TaskList tasks={column.tasks} colId={column.id} color={column.color ? column.color : '#3c3c3c'} />
                              </Column>
                           ))
                        }
                     </DndContext>
                  ) : (
                     <div className="text-center py-24 text-red-600 text-lg font-semibold">
                        {t("column.loadError", { error: getErrorMessage(error) })}
                     </div>
                  )
               )
            }
         </div>
      </>
   );
};

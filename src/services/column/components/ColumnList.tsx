import { useMemo } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
   DndContext,
   useSensor,
   useSensors,
   PointerSensor,
   type DragEndEvent,
} from "@dnd-kit/core";
import { useMoveTaskMutation } from "@/services/tasks/api/taskApi";
import { TaskList } from "@/services/tasks/components/TaskList";
import { useChangeOrderMutation, useGetAllColumnsQuery } from "../api/columnApi";
import { ColumnSkeleton } from "./ColumnSkeleton";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { Column } from "./Column";
import { cn } from "@/shared/utils/cn";

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


   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: { distance: 8 },
      })
   );

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

   const content = (() => {
      if (isLoading) {
         return (
            Array.from({ length: 4 }).map((_, index) => (
               <ColumnSkeleton key={index} />
            ))
         )
      }

      if (isError) {
         return (
            <div className="text-center py-24 text-red-600 text-lg font-semibold">
               {t("column.loadError", { error: getErrorMessage(error) })}
            </div>
         )
      }

      if (sortedColumns.length === 0) {
         return (
            <div>No columns</div>
         )
      }

      return (
         sortedColumns?.map((column) => (
            <Column key={column.id} column={column}>
               <TaskList tasks={column.tasks} colId={column.id} color={column.color ? column.color : '#3c3c3c'} />
            </Column>
         ))
      )
   })()

   return (
      <>
         <div
            className={cn(
               "gap-5 items-start grid-flow-col auto-cols-[350px] overflow-x-auto",
               "overscroll-x-contain scrollbar-gutter-stable",
               "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border pb-5",
               isError ? 'block' : 'grid'
            )}>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
               {content}
            </DndContext>
         </div>
      </>
   );
};

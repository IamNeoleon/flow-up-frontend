import { useTranslation } from "react-i18next";
import { useDndBoard } from "../hooks/use-dnd-board";
import { useMemo } from "react";
import { ColumnSkeleton } from "@/services/column/components/ColumnSkeleton";
import { Column } from "@/services/column/components/Column";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "@/services/tasks/components/TaskCard";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { cn } from "@/shared/utils/cn";

interface IProps {
   boardId: string
}


export const KanbanBoard = ({ boardId }: IProps) => {
   const { t } = useTranslation();
   const {
      isLoading,
      isError,
      localColumns,
      tasksByColumn,
      error,
      onDragStart,
      onDragOver,
      onDragEnd,
      activeTask,
      activeColumn,
      colIds,
      sensors
   } = useDndBoard(boardId)

   const content = useMemo(() => {
      if (isLoading) return (
         Array.from({ length: 4 }).map((_, i) => <ColumnSkeleton key={i} />)
      );
      if (isError) return (
         <div className="text-center py-24 text-red-600 text-lg font-semibold">
            {t("column.loadError", { error: getErrorMessage(error) })}
         </div>
      )
      if (localColumns.length === 0) return (
         <div className="text-center py-24 text-gray-500 text-lg">
            {t("column.noColumns")}
         </div>
      )

      return localColumns.map((column) => (
         <Column
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id] ?? []}
         />
      ));
   }, [isLoading, isError, localColumns, tasksByColumn, t, error]);

   return (
      <div className={cn(
         "overflow-x-auto py-4",
         "overscroll-contain scrollbar-gutter-stable",
         "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border",
      )}>
         <div className="flex gap-4 min-w-max">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
               <SortableContext items={colIds} strategy={horizontalListSortingStrategy}>
                  {content}
               </SortableContext>

               {createPortal(
                  <DragOverlay>
                     {activeTask && <TaskCard task={activeTask} color={activeTask.color} />}
                     {activeColumn && <Column column={activeColumn} tasks={tasksByColumn[activeColumn.id] ?? []} />}
                  </DragOverlay>,
                  document.body
               )}
            </DndContext>
         </div>
      </div>
   );
};

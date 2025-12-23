import { useMoveTaskMutation } from "@/api/endpoints/taskApi";
import type { IColumn } from "@/shared/types/column.types";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Column } from "./Column";
import { TaskList } from "@/features/tasks/components/TaskList";
import { useChangeOrderMutation } from "@/api/endpoints/columnApi";

interface IColumnListProps {
   boardColumns: IColumn[],
   boardId: string
}

export const ColumnList = ({ boardColumns, boardId }: IColumnListProps) => {
   const [columns, setColumns] = useState<IColumn[]>([]);
   const [updateTask] = useMoveTaskMutation()
   const [changeOrder] = useChangeOrderMutation()

   const handleDragEnd = async (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over) return;

      const activeType: string = active.data.current?.type
      const overType: string = over.data.current?.type

      if (activeType === 'task' && overType === 'column') {
         const oldCol = columns.find(col => col.tasks.find(task => task.id === active.id));
         const newCol = columns.find(col => col.id === over.id);

         if (!oldCol || !newCol) return;
         if (oldCol.id === newCol.id) return;

         const prevCols = [...columns];
         const taskToMove = oldCol.tasks.find((task) => task.id === active.id);
         if (!taskToMove) return;

         setColumns(prev => {
            return prev.map(col => {
               if (col.id === oldCol.id) {
                  return {
                     ...col,
                     tasks: col.tasks.filter(task => task.id !== active.id)
                  }
               }
               if (col.id === newCol.id) {
                  return {
                     ...col,
                     tasks: [...col.tasks, taskToMove]
                  }
               }
               return col;
            })
         })

         try {
            await updateTask({
               colId: oldCol.id,
               targetColId: newCol.id,
               taskId: taskToMove.id
            }).unwrap();
         } catch (error) {
            console.error('Ошибка при сохранении на сервере', error);
            setColumns(prevCols);
         }

         return;
      }

      if (activeType === 'column' && overType === 'column') {
         const prevCols = [...columns]


         setColumns(prev => {
            const copy = prev.map(col => ({ ...col }));
            const oldCol = copy.find(col => col.id === active.id)
            const newCol = copy.find(col => col.id === over.id)
            if (!oldCol || !newCol) return prev;
            const oldColOrder = oldCol.order
            oldCol.order = newCol.order
            copy.forEach(col => {
               if (col.id !== oldCol.id && col.order <= newCol.order && col.order > oldColOrder) {
                  col.order -= 1
               }
               if (col.id !== oldCol.id && col.order >= newCol.order && col.order < oldColOrder) {
                  col.order += 1
               }
            })
            console.log(copy);


            return copy.sort((a, b) => a.order - b.order);
         })

         const colId = active.id as string
         const newCol = prevCols.find(col => col.id === over.id)
         if (!newCol) return

         try {
            changeOrder({
               boardId,
               colId,
               newOrder: newCol.order
            }).unwrap()
         } catch (error) {
            console.error('Ошибка при сохранении на сервере', error);
            setColumns(prevCols);
         }
      }
   }

   useEffect(() => {
      const sortedCols = [...boardColumns].sort((a, b) => a.order - b.order)
      setColumns(sortedCols)
   }, [boardColumns])

   return (
      <>
         <div className="grid grid-cols-3 gap-10">
            <DndContext onDragEnd={handleDragEnd}>
               {
                  columns.map((column) => (
                     <Column key={column.id} column={column}>
                        <TaskList tasks={column.tasks} colId={column.id} />
                     </Column>
                  ))
               }
            </DndContext>
         </div>
      </>
   );
};

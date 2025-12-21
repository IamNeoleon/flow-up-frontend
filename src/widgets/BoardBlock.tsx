import { useMoveTaskMutation } from "@/api/endpoints/taskApi";
import { Column } from "@/features/column/components/Column";
import { TaskList } from "@/features/tasks/components/TaskList";
import type { IBoard } from "@/shared/types/board.types";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

interface IBoardBlockProps {
   board: IBoard
}

export const BoardBlock = ({ board }: IBoardBlockProps) => {
   const [columns, setColumns] = useState(board.columns);
   const [updateTask, { isError }] = useMoveTaskMutation()

   const handleDragEnd = async (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over) return;

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
   }

   return (
      <>
         <h1 className='text-4xl font-bold'>{board.name}</h1>
         <p className='text-lg mt-2 mb-5'>{board.description}</p>
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


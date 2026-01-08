import { TaskCard } from "./TaskCard";
import { useModal } from "@/app/providers/ModalProvider";
import { CreateTask } from "./CreateTask";
import { useParams } from "react-router";
import type { ITaskPreview } from "@/shared/types/task.types";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";

interface ITaskListProps {
   tasks: ITaskPreview[];
   colId: string;
   color?: string;
}

export const TaskList = ({ tasks, colId, color }: ITaskListProps) => {
   const { open, close } = useModal()
   const permissions = useAppSelector(selectPermissions)

   const { boardId } = useParams()
   if (!boardId) return null

   const handleCreateTask = () => {
      open({
         title: 'Создать задачу',
         description: 'Создание новой задачи',
         content: <CreateTask close={close} boardId={boardId} colId={colId} />
      })
   }

   return (
      <>
         {
            tasks.map((task) => (
               <TaskCard key={task.id} task={task} color={color} />
            ))
         }
         {
            permissions?.canCreateTask && (
               <button onClick={handleCreateTask} className="relative w-full border text-left p-3 mb-2 transition-colors rounded-lg">
                  <div style={{ backgroundColor: color }} className="absolute inset-0 rounded-lg transition-colors brightness-[0.3] hover:brightness-50">
                  </div>
                  <span style={{ color }} className="font-medium relative z-10 pointer-events-none">+ New Task</span>
               </button>
            )
         }
      </>
   );
};

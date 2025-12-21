import type { ITask } from "@/shared/types/task.types";
import { TaskCard } from "./TaskCard";
import { useModal } from "@/app/providers/ModalProvider";
import { CreateTask } from "./CreateTask";
import { useParams } from "react-router";

interface ITaskListProps {
   tasks: ITask[];
   colId: string;
}

export const TaskList = ({ tasks, colId }: ITaskListProps) => {
   const { open, close } = useModal()
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
               <TaskCard key={task.id} task={task} />
            ))
         }
         <button onClick={handleCreateTask} className="w-full text-left p-3 mb-2 bg-[#252525] transition-colors rounded-md hover:bg-[#363333]">
            + New Task
         </button>
      </>
   );
};

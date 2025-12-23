import type { ITask } from "@/shared/types/task.types";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";

interface ITaskCardProps {
   task: ITask;
}

export const TaskCard = ({ task }: ITaskCardProps) => {
   const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
         id: task.id,
         data: {
            type: 'task',
            id: task.id
         }
      });

   const style = {
      transform: transform
         ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
         : undefined,
   };

   return (
      <div
         ref={setNodeRef}
         {...attributes}
         {...listeners}
         style={style}
         className={clsx(
            "p-3 mb-2 bg-[#252525] rounded-md cursor-grab",
            isDragging && "opacity-70"
         )}
      >
         <h3 className="font-medium">{task.name}</h3>
      </div>
   );
};

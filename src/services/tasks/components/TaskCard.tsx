import clsx from "clsx";
import { useNavigate } from "react-router";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import type { ITaskPreview } from "../types/task-preview";
import { cn } from "@/shared/utils/cn";
import { isTouchDevice } from "@/shared/lib/is-touch-device";

interface ITaskCardProps {
   task: ITaskPreview;
   color?: string;
}

export const TaskCard = ({ task, color }: ITaskCardProps) => {
   const navigate = useNavigate()

   const permissions = useAppSelector(selectPermissions)
   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: task.id,
      data: {
         type: 'task',
         id: task.id,
         color: color,
         task: task
      }
   });

   const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
   }

   const navigateToDetails = () => {
      navigate(`${task.colId}/tasks/${task.id}`)
   }

   return (
      <div
         ref={setNodeRef}
         style={{ ...style }}
         className={clsx(
            "p-3 mb-2 relative rounded-md cursor-pointer group",
            isDragging && "opacity-70 z-1000"
         )}
         onClick={navigateToDetails}
      >
         <div style={{ backgroundColor: color }} className={clsx("absolute inset-0 rounded-lg brightness-50 dark:brightness-40")} />
         <h3 className="font-medium relative z-10 pr-5 text-white">{task.name}</h3>
         {
            permissions?.canMoveTask && (
               <div {...attributes} {...listeners}
                  className={cn("touch-none group-hover:opacity-100 hover:cursor-grab opacity-0 transition-opacity absolute top-1/2 -translate-y-1/2 right-2 z-10",
                     {
                        'hover:cursor-grabbing cursor-grabbing': isDragging,
                        'opacity-100': isTouchDevice()
                     })}
               >
                  <GripVertical width={21} className="text-white" />
               </div>
            )
         }
      </div>
   );
};

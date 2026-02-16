import { memo, useCallback } from "react";
import { useNavigate } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import { cn } from "@/shared/utils/cn";
import { isTouchDevice } from "@/shared/lib/is-touch-device";
import type { ITaskPreview } from "../types/task-preview";

interface IProps {
   task: ITaskPreview;
   color?: string;
}

export const TaskCard = memo(({ task, color }: IProps) => {
   const navigate = useNavigate();
   const permissions = useAppSelector(selectPermissions);

   const { setNodeRef, attributes, listeners, isDragging, transition, transform } = useSortable({
      id: task.id,
      data: { type: "Task", task, taskColor: color }
   });

   const style = {
      transition,
      transform: CSS.Transform.toString(transform)
   };

   const navigateToDetails = useCallback(() => {
      navigate(`${task.colId}/tasks/${task.id}`);
   }, [navigate, task.colId, task.id]);

   return (
      <div
         style={style}
         ref={setNodeRef}
         className={cn("p-3 mb-2 relative rounded-md cursor-pointer group", isDragging && "opacity-60")}
         onClick={navigateToDetails}
      >
         <div style={{ backgroundColor: color }} className="absolute inset-0 rounded-lg brightness-50 dark:brightness-40" />

         <div className="relative z-10 pr-5">
            <h3 className="font-medium text-white">{task.name}</h3>
         </div>

         {permissions?.canMoveTask && (
            <div
               {...attributes}
               {...listeners}
               onClick={(e) => e.stopPropagation()}
               className={cn(
                  "touch-none group-hover:opacity-100 hover:cursor-grab opacity-0 transition-opacity absolute top-1/2 -translate-y-1/2 right-2 z-10",
                  { "hover:cursor-grabbing cursor-grabbing": isDragging, "opacity-100": isTouchDevice() }
               )}
            >
               <GripVertical width={21} className="text-white" />
            </div>
         )}
      </div>
   );
}, (prev, next) => {
   return (
      prev.task.id === next.task.id &&
      prev.task.name === next.task.name &&
      prev.task.order === next.task.order &&
      prev.task.colId === next.task.colId &&
      prev.color === next.color
   );
});

TaskCard.displayName = "TaskCard";
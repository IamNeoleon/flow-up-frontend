import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import type { ITaskPreview } from "../types/task-preview";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/shared/ui/shadcn/sheet";
import { TaskDetails } from "./TaskDetails";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ITaskCardProps {
   task: ITaskPreview;
   color?: string;
}

export const TaskCard = ({ task, color }: ITaskCardProps) => {
   const permissions = useAppSelector(selectPermissions)
   const [openSheet, setOpenSheet] = useState(false);
   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: task.id,
      data: {
         type: 'task',
         id: task.id
      }
   });
   const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
   }

   return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
         <SheetTrigger asChild>
            <div
               ref={setNodeRef}
               style={style}
               className={clsx(
                  "p-3 mb-2 relative z-30 rounded-md cursor-pointer group",
                  isDragging && "opacity-70"
               )}
            >
               <div style={{ backgroundColor: color }} className="absolute inset-0 rounded-lg brightness-50" />
               <h3 className="font-medium relative z-10 pr-5 text-white">{task.name}</h3>
               {
                  permissions?.canMoveTask && (
                     <div {...attributes} {...listeners}
                        className={clsx("group-hover:opacity-100 hover:cursor-grab opacity-0 transition-opacity absolute top-1/2 -translate-y-1/2 right-2 z-10",
                           { 'hover:cursor-grabbing cursor-grabbing': isDragging })}
                     >
                        <GripVertical width={21} className="text-white" />
                     </div>
                  )
               }
            </div>
         </SheetTrigger>
         <SheetContent style={{ width: "50%", maxWidth: '100%' }}>
            <SheetTitle>
               <VisuallyHidden>Редактирование задачи</VisuallyHidden>
            </SheetTitle>
            <TaskDetails taskId={task.id} colId={task.colId} onClose={() => setOpenSheet(false)} />
         </SheetContent>
      </Sheet>
   );
};

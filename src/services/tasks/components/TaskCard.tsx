import { memo } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, Trash2 } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import { cn } from "@/shared/utils/cn";
import type { ITaskPreview } from "../types/task-preview";

interface IProps {
   task: ITaskPreview;
   color?: string;
}

export const TaskCard = memo(({ task, color }: IProps) => {
   const { t } = useTranslation()

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

   const navigateToDetails = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`${task.colId}/tasks/${task.id}`);
   };

   const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Delete Click');
   };

   return (
      <div
         style={style}
         ref={setNodeRef}
         className={cn("p-3 mb-2 relative cursor-grab group", isDragging && "opacity-60 cursor-grabbing")}
         {...(permissions?.canMoveTask ? attributes : {})}
         {...(permissions?.canMoveTask ? listeners : {})}
      >
         <div style={{ backgroundColor: color }} className="absolute inset-0 rounded-sm brightness-50 dark:brightness-40" />
         <div className="relative z-10">
            <h3 style={{ borderColor: color }} className="font-medium text-white border-b leading-tight pb-1 line-clamp-2 overflow-hidden wrap-break-word max-w-full">
               {task.name}
            </h3>
            <div className="pt-1 flex justify-between items-center text-[11px] brightness-100 text-white">
               <div className="flex gap-3">
                  <div>
                     <div className="">{t('task.priority')}</div>
                     <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-amber-700 rounded-full"></div>
                        <span className="">Medium</span>
                     </div>
                  </div>
                  <div>
                     <div className="">{t('task.dueDate')}</div>
                     <div>13/04/2022</div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={handleDelete} className="cursor-pointer hover:text-white/70 transition-colors">
                     <Trash2 size={16} />
                  </button>
                  <button title={t('task.open')} onClick={navigateToDetails} className="cursor-pointer hover:text-white/70 transition-colors">
                     <ExternalLink size={16} />
                  </button>
               </div>
            </div>
         </div>
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
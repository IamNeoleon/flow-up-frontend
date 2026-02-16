// TaskList.tsx
import { memo, useCallback } from "react";
import { TaskCard } from "./TaskCard";
import { useModal } from "@/app/providers/ModalProvider";
import { CreateTask } from "./CreateTask";
import { useParams } from "react-router";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import type { ITaskPreview } from "../types/task-preview";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ITaskListProps {
   tasks: ITaskPreview[];
   colId: string;
   color?: string;
}

export const TaskList = memo(({ tasks, colId, color }: ITaskListProps) => {
   const { t } = useTranslation();
   const { open, close } = useModal();
   const permissions = useAppSelector(selectPermissions);

   const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

   const { boardId } = useParams();

   const handleCreateTask = useCallback(() => {
      if (!boardId) return;
      open({
         title: t("task.create"),
         description: t("task.createDescription"),
         content: <CreateTask close={close} boardId={boardId} colId={colId} />
      });
   }, [boardId, colId, open, close, t]);

   if (!boardId) return null;

   return (
      <div className="flex flex-col h-full">
         {/* Скроллируемая область с задачами */}
         <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-white/20
            hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
         >
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
               {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} color={color} />
               ))}
            </SortableContext>
         </div>

         {permissions?.canCreateTask && (
            <div className="pt-2 shrink-0">
               <button
                  onClick={handleCreateTask}
                  className="relative w-full text-left p-3 transition-colors rounded-lg"
               >
                  <div
                     style={{ backgroundColor: color }}
                     className="absolute inset-0 rounded-lg transition-colors brightness-[0.4] hover:brightness-50"
                  />
                  <span
                     style={{ color }}
                     className="font-medium relative z-10 pointer-events-none"
                  >
                     {t("task.newTask")}
                  </span>
               </button>
            </div>
         )}
      </div>
   );
}, (prev, next) => {
   return (
      prev.colId === next.colId &&
      prev.color === next.color &&
      prev.tasks.length === next.tasks.length &&
      prev.tasks.every((task, i) =>
         task.id === next.tasks[i]?.id &&
         task.order === next.tasks[i]?.order &&
         task.name === next.tasks[i]?.name
      )
   );
});

TaskList.displayName = "TaskList";
import { memo } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/shared/utils/cn";
import { EditColumn } from "./EditColumn";
import { DeleteColumn } from "./DeleteColumn";
import { TaskList } from "@/services/tasks/components/TaskList";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import type { IColumn } from "../types/column";
import type { ITaskPreview } from "@/services/tasks/types/task-preview";

interface IColumnProps {
   column: IColumn;
   tasks: ITaskPreview[];
}

export const Column = memo(({ column, tasks }: IColumnProps) => {
   const columnApiColor = column.color ?? "#3c3c3c";
   const permissions = useAppSelector(selectPermissions);

   const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: column.id,
      data: { type: "Column", column },
   });

   console.log(`${column.name} rerendered`);


   const style = { transition, transform: CSS.Transform.toString(transform) };

   return (
      <div ref={setNodeRef} style={style} className={cn("min-w-[350px] relative shadow-2xl h-[600px]", isDragging && "opacity-90 z-20")}>
         <div className="absolute inset-0 rounded-lg brightness-[0.4] dark:brightness-[0.3]" style={{ backgroundColor: columnApiColor }} />
         <div className="relative z-10 p-5 flex flex-col h-full">
            <div className="group flex items-center justify-between w-full border-b mb-2 pb-1 flex-shrink-0" style={{ borderColor: columnApiColor }}>
               <h2 className="text-lg text-white font-semibold">{column.name}</h2>
               <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  {permissions?.canEditBoard && <EditColumn status={column.status} color={columnApiColor} colId={column.id} boardId={column.boardId} title={column.name} />}
                  {permissions?.canDeleteColumn && <DeleteColumn boardId={column.boardId} colId={column.id} />}
                  {permissions?.canMoveColumn && (
                     <div {...listeners} {...attributes} className="cursor-grab">
                        <GripVertical size={20} color="#ffffff" />
                     </div>
                  )}
               </div>
            </div>

            <div className="flex-1 min-h-0">
               <TaskList colId={column.id} color={columnApiColor} tasks={tasks} />
            </div>
         </div>
      </div>
   );
}, (prev, next) => {
   return (
      prev.column.id === next.column.id &&
      prev.column.name === next.column.name &&
      prev.column.color === next.column.color &&
      prev.column.order === next.column.order &&
      prev.tasks.length === next.tasks.length &&
      prev.tasks.every((task, i) =>
         task.id === next.tasks[i]?.id &&
         task.order === next.tasks[i]?.order &&
         task.name === next.tasks[i]?.name
      )
   );
});

Column.displayName = "Column";
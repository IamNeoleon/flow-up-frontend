import { useEffect, useState } from "react";
import { Goal } from "lucide-react";
import { ValuePicker } from "@/shared/ui/ValuePicker";
import { Badge } from "@/shared/ui/shadcn/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/shadcn/dropdown-menu"
import type { ITaskPriority } from "../types/task-priority";
import { useGetPrioritiesQuery } from "@/services/tasks/api/taskApi";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectCurrentBoardId } from "@/store/slices/boardSlice";
import { useTranslation } from "react-i18next";


interface ITaskPriorityProps {
   taskPriorityId?: string,
   onChange: (value: ITaskPriority) => void,
   colId: string
}

export const TaskPriority = ({ taskPriorityId, onChange, colId }: ITaskPriorityProps) => {
   const { t } = useTranslation()
   const boardId = useAppSelector(selectCurrentBoardId)
   const { data: priorities } = useGetPrioritiesQuery({ boardId, colId });
   const [priority, setPriority] = useState<ITaskPriority | null>(null)
   const [open, setOpen] = useState(false)

   useEffect(() => {
      if (!priorities) return

      const taskPriority = priorities.find((item) => item.id === taskPriorityId)

      if (taskPriority) {
         setPriority(taskPriority)
      }
   }, [priorities, taskPriorityId])

   return (
      <>
         <div>
            <div className="flex mb-1 gap-1 items-center text-base text-[#ada9a3] font-medium">
               <Goal width={18} />
               <span>{t("task.priority")}</span>
            </div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
               <DropdownMenuTrigger asChild>
                  <div>
                     <ValuePicker>
                        {priority && (
                           <Badge style={{ backgroundColor: priority.color }} className="capitalize text-sm text-white">{priority.name}</Badge>
                        )}
                     </ValuePicker>
                  </div>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                  {priorities?.map(priority => (
                     <DropdownMenuItem
                        onClick={() => {
                           setOpen(false)
                           onChange(priority)
                        }}
                     >
                        {priority.name}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </>
   );
};

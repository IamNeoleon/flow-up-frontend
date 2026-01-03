import { Calendar as CalendarIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/shadcn/dropdown-menu"
import { useState } from "react";
import { ValuePicker } from "@/shared/ui/ValuePicker";
import { formatDate } from "@/shared/utils";
import { Calendar } from "@/shared/ui/shadcn/calendar";

interface ITaskDueDateProps {
   dueDate: string | undefined,
   setDueDate: (value: Date | undefined) => void
}

export const TaskDueDate = ({ dueDate, setDueDate }: ITaskDueDateProps) => {
   // TODO: сделай плавный апдейт даты
   const [open, setOpen] = useState(false)

   const onSelect = (value: Date | undefined) => {
      setOpen(false)
      setDueDate(value)
   }

   return (
      <>
         <div>
            <div className="flex mb-1 gap-1 items-center text-base text-[#ada9a3] font-medium">
               <CalendarIcon width={18} />
               <span>Дедлайн</span>
            </div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
               <DropdownMenuTrigger asChild>
                  <div>
                     <ValuePicker>
                        {dueDate && (
                           <div className="text-md">
                              {formatDate(dueDate)}
                           </div>
                        )}
                     </ValuePicker>
                  </div>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                  <Calendar
                     required={false}
                     mode="single"
                     onSelect={(value) => onSelect(value)} selected={dueDate ? new Date(dueDate) : new Date}
                  />
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </>
   );
};

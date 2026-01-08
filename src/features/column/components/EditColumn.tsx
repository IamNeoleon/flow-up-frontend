import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/shadcn/popover";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { CircleQuestionMark, Pencil } from "lucide-react";
import { useState } from "react";
import { HexColorPicker as ColorPicker } from "react-colorful";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shared/ui/shadcn/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/shadcn/tooltip"
import { useEditColumnMutation } from "@/api/endpoints/columnApi";
import { toast } from "sonner";
import type { TColumnStatus } from "../types";
import { TASK_STATUS_LABELS } from "../constants";
import { Label } from "@/shared/ui/shadcn/label";

interface IEditColumnProps {
   title: string
   boardId: string
   colId: string,
   color: string
   status: TColumnStatus
}

export const EditColumn = ({ title, boardId, colId, color, status }: IEditColumnProps) => {
   const [edit] = useEditColumnMutation();
   const [draftTitle, setDraftTitle] = useState(title);
   const [draftColor, setDraftColor] = useState(color);
   const [draftStatus, setDraftStatus] = useState(status);
   const [open, setOpen] = useState(false)

   const handleEdit = async () => {
      const toastId = toast.loading('Создание задачи...')

      try {
         await edit({
            boardId,
            colId,
            name: draftTitle,
            color: draftColor,
            status: draftStatus
         }).unwrap();

         toast.success("Успешное редактирование", { id: toastId });
         setOpen(false)
      } catch (err) {
         toast.error("Ошибка при редактировании", { id: toastId });
      }
   }

   return (
      <>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button size="icon" variant="ghost">
                  <Pencil />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-56 space-y-2">
               <div>
                  <Label htmlFor="edit-column-name" className="mb-1">Название</Label>
                  <Input id="edit-column-name" placeholder="Название" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
               </div>
               <div>
                  <div className="flex items-center justify-between">
                     <Label htmlFor="edit-column-status" className="mb-1">Системный статус</Label>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <CircleQuestionMark size={18} className="text-[#8d8d8d]" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px] space-y-2 font-medium">
                           <p>
                              Системный статус колонки определяет, как система учитывает задачи внутри неё.
                           </p>
                           <p>
                              Он влияет на подсчёт прогресса, фильтрацию и автоматические действия на доске.
                           </p>
                           <p>
                              Колонки со статусом «Не начато» считаются исходными, «В работе» — активными, а «Готово» — завершёнными.
                           </p>
                           <p>
                              Вы можете менять название колонки, но сам системный статус определяет её роль в логике доски.
                           </p>
                           <p>
                              Изменение этого статуса может повлиять на отображение и обработку задач.
                           </p>
                        </TooltipContent>
                     </Tooltip>
                  </div>
                  <div id="edit-column-status">
                     <Select value={draftStatus} onValueChange={(value) => setDraftStatus(value as TColumnStatus)}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                           {
                              Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                                 <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))
                           }
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div>
                  <Label htmlFor="edit-column-color" className="mb-1">Цвет колонки</Label>
                  <ColorPicker id="edit-column-color" style={{ width: "100%" }} color={draftColor} onChange={setDraftColor} />
               </div>
               <Button onClick={handleEdit} size="sm" className="w-full">Сохранить</Button>
            </PopoverContent>
         </Popover>

      </>
   );
};

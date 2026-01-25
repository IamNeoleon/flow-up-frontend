import { useState } from "react";
import { HexColorPicker as ColorPicker } from "react-colorful";
import { CircleQuestionMark } from "lucide-react";
import { toast } from "sonner";
import { useCreateColumnMutation } from "../api/columnApi";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shared/ui/shadcn/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/shadcn/tooltip"
import { Label } from "@/shared/ui/shadcn/label";
import { COLUMN_STATUS_LABELS } from "../constants/column-status";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import type { TColumnStatus } from "../types/column-status";

interface ICreateColumnProps {
   boardId: string,
   close: () => void
}

export const CreateColumn = ({ boardId, close }: ICreateColumnProps) => {
   const [name, setName] = useState('')
   const [status, setStatus] = useState<TColumnStatus>('TODO')
   const [color, setColor] = useState<string>('#3c3c3c');
   const [create] = useCreateColumnMutation()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         await create({
            boardId,
            name,
            status,
            color
         }).unwrap()
         toast.success('Успешное создание')
      } catch (error: any) {
         const err = getErrorMessage(error)
         console.error(err)
         toast.error('Произошла ошибка при создании колонки')
      }
      close()
   }

   return (
      <>
         <form onSubmit={handleSubmit}>
            <div className="mb-3 flex flex-col gap-2">
               <div>
                  <Label htmlFor="create-column-name" className="text-base mb-1">Введите название колонки</Label>
                  <Input required id="create-column-name" className="" value={name} onChange={(e) => setName(e.target.value)} placeholder="Пример: Тестирование" />
               </div>
               <div>
                  <div className="flex items-center justify-between">
                     <Label htmlFor="create-column-status" className="text-base mb-1">Выберите системный статус колонки</Label>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <CircleQuestionMark size={20} className="text-[#8d8d8d]" />
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
                  <div id="create-column-status">
                     <Select value={status} onValueChange={(value) => setStatus(value as TColumnStatus)}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                           {
                              Object.entries(COLUMN_STATUS_LABELS).map(([value, label]) => (
                                 <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))
                           }
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div>
                  <Label htmlFor="create-color-picker" className="text-base mb-1">Выберите цвет колонки</Label>
                  <ColorPicker id="create-color-picker" style={{ width: "100%" }} color={color} onChange={setColor} />
               </div>
            </div>
            <Button className="w-full" type="submit">Создать</Button>
         </form>
      </>
   );
};
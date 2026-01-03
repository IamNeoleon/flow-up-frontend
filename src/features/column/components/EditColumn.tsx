import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/shadcn/popover";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { HexColorPicker as ColorPicker } from "react-colorful";
import { useEditColumnMutation } from "@/api/endpoints/columnApi";
import { toast } from "sonner";

interface IEditColumnProps {
   title: string
   boardId: string
   colId: string,
   color: string
}

export const EditColumn = ({ title, boardId, colId, color }: IEditColumnProps) => {
   const [edit] = useEditColumnMutation();
   const [draftTitle, setDraftTitle] = useState(title);
   const [draftColor, setDraftColor] = useState(color);
   const [open, setOpen] = useState(false)


   const handleEdit = async () => {
      const toastId = toast.loading('Создание задачи...')

      try {
         await edit({
            boardId,
            colId,
            name: draftTitle,
            color: draftColor
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

            <PopoverContent className="w-56 space-y-3">
               <Input placeholder="Название" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
               <ColorPicker style={{ width: "100%" }} color={draftColor} onChange={setDraftColor} />
               <Button onClick={handleEdit} size="sm" className="w-full">Сохранить</Button>
            </PopoverContent>
         </Popover>

      </>
   );
};

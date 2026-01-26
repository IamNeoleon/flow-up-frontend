import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/shadcn/popover";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { CircleQuestionMark, Pencil } from "lucide-react";
import { useState } from "react";
import { HexColorPicker as ColorPicker } from "react-colorful";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shared/ui/shadcn/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/shadcn/tooltip"
import { useEditColumnMutation } from "../api/columnApi";
import { toast } from "sonner";
import type { TColumnStatus } from "../types/column-status";
import { COLUMN_STATUS_LABELS } from "../constants/column-status";
import { Label } from "@/shared/ui/shadcn/label";
import { useTranslation } from "react-i18next";

interface IEditColumnProps {
   title: string
   boardId: string
   colId: string,
   color: string
   status: TColumnStatus
}

export const EditColumn = ({ title, boardId, colId, color, status }: IEditColumnProps) => {
   const { t } = useTranslation()
   const [edit] = useEditColumnMutation();
   const [draftTitle, setDraftTitle] = useState(title);
   const [draftColor, setDraftColor] = useState(color);
   const [draftStatus, setDraftStatus] = useState(status);
   const [open, setOpen] = useState(false)

   const handleEdit = async () => {
      const toastId = toast.loading(t("column.editLoading"))

      try {
         await edit({
            boardId,
            colId,
            name: draftTitle,
            color: draftColor,
            status: draftStatus
         }).unwrap();

         toast.success(t("column.editSuccess"), { id: toastId });
         setOpen(false)
      } catch (err) {
         toast.error(t("column.editError"), { id: toastId });
      }
   }

   return (
      <>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button className="group" size="icon" variant="ghost">
                  <Pencil className="text-white hover:text-black" />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-56 space-y-2">
               <div>
                  <Label htmlFor="edit-column-name" className="mb-1">{t("column.nameLabel")}</Label>
                  <Input id="edit-column-name" placeholder={t("column.namePlaceholder")} value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
               </div>
               <div>
                  <div className="flex items-center justify-between">
                     <Label htmlFor="edit-column-status" className="mb-1">{t("column.statusLabel")}</Label>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <CircleQuestionMark size={18} className="text-[#8d8d8d]" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px] space-y-2 font-medium">
                           <p>
                              {t("column.statusHelp1")}
                           </p>
                           <p>
                              {t("column.statusHelp2")}
                           </p>
                           <p>
                              {t("column.statusHelp3")}
                           </p>
                           <p>
                              {t("column.statusHelp4")}
                           </p>
                           <p>
                              {t("column.statusHelp5")}
                           </p>
                        </TooltipContent>
                     </Tooltip>
                  </div>
                  <div id="edit-column-status">
                     <Select value={draftStatus} onValueChange={(value) => setDraftStatus(value as TColumnStatus)}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder={t("column.statusPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                           {
                              Object.entries(COLUMN_STATUS_LABELS).map(([value, label]) => (
                                 <SelectItem key={value} value={value}>{t(label)}</SelectItem>
                              ))
                           }
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div>
                  <Label htmlFor="edit-column-color" className="mb-1">{t("column.colorLabel")}</Label>
                  <ColorPicker id="edit-column-color" style={{ width: "100%" }} color={draftColor} onChange={setDraftColor} />
               </div>
               <Button onClick={handleEdit} size="sm" className="w-full">{t("common.save")}</Button>
            </PopoverContent>
         </Popover>

      </>
   );
};

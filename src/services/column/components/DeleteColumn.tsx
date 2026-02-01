import { useDeleteColumnMutation } from "../api/columnApi";
import { Button } from "@/shared/ui/shadcn/button";
import { Trash2 } from "lucide-react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/shared/ui/shadcn/alert-dialog"
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

interface IDeleteColumnProps {
   boardId: string,
   colId: string
}

export const DeleteColumn = ({ boardId, colId }: IDeleteColumnProps) => {
   const { t } = useTranslation()
   const [deleteCol] = useDeleteColumnMutation()
   const [open, setOpen] = useState(false)

   const handleDelete = async () => {
      setOpen(false)
      try {
         await deleteCol({ colId, boardId }).unwrap()
         toast.success(t("column.deleteSuccess"))
      } catch (error) {
         const err = getErrorMessage(error as FetchBaseQueryError | SerializedError | undefined)
         toast.error(t("column.deleteError", { error: err }))
      }
   }

   return (
      <>
         <Button className="" onClick={() => setOpen(true)} size='icon' variant='ghost'>
            <Trash2 className="text-white hover:text-black" />
         </Button>
         <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>{t("column.deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                     {t("column.deleteConfirmDescription")}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>{t("common.yes")}</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};

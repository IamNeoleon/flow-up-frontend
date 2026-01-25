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

interface IDeleteColumnProps {
   boardId: string,
   colId: string
}

export const DeleteColumn = ({ boardId, colId }: IDeleteColumnProps) => {
   const [deleteCol] = useDeleteColumnMutation()
   const [open, setOpen] = useState(false)

   const handleDelete = async () => {
      setOpen(false)
      try {
         await deleteCol({ colId, boardId }).unwrap()
         toast.success('Успешное удаление')
      } catch (error) {
         const err = getErrorMessage(error as FetchBaseQueryError | SerializedError | undefined)
         toast.error(`Произошла ошибка при удаление колонки: ${err}`)
      }
   }

   return (
      <>
         <Button onClick={() => setOpen(true)} size='icon' variant='ghost'>
            <Trash2 />
         </Button>
         <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Вы действительно хотите удалить колонку?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Это действие необратимо.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Да</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};

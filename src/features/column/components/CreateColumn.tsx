import { useCreateColumnMutation } from "@/api/endpoints/columnApi";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface ICreateColumnProps {
   boardId: string,
   close: () => void
}

export const CreateColumn = ({ boardId, close }: ICreateColumnProps) => {
   const [name, setName] = useState('')
   const [create] = useCreateColumnMutation()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
         await create({
            boardId,
            name
         }).unwrap()
         toast.success('Успешное создание')
      } catch (error: any) {
         const message =
            error?.data?.message ||
            error?.error ||
            'Не удалось создать колонку'
         toast.error(`Ошибка при создании колонки: ${message}`)
      }

      close()
   }

   return (
      <>
         <form onSubmit={handleSubmit}>
            <Input className="mb-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите название колонки" />
            <Button className="w-full" type="submit">Создать</Button>
         </form>
      </>
   );
};

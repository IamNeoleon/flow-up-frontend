import { useCreateTaskMutation } from "@/api/endpoints/taskApi";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { useState } from "react";
import { toast } from "sonner";

interface ICreateTaskProps {
   close: () => void;
   boardId: string;
   colId: string;
}

export const CreateTask = ({ close, boardId, colId }: ICreateTaskProps) => {
   const [create] = useCreateTaskMutation()
   const [name, setName] = useState('')

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const toastId = toast.loading('Создание задачи...')

      try {
         await create({
            boardId,
            colId,
            name,
         }).unwrap();

         toast.success("Задача создана", { id: toastId });
         close();
      } catch (err) {
         toast.error("Не удалось создать задачу", { id: toastId });
      }
   }

   return (
      <>
         <form onSubmit={handleSubmit}>
            <Input value={name} onChange={(e) => setName(e.target.value)} name='title' required placeholder='Введите название задачи' />
            <Button className='w-full mt-4' type='submit'>Создать</Button>
         </form>
      </>
   );
};

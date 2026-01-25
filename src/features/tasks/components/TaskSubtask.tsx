import clsx from "clsx";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useDebouncedCallback } from "use-debounce";
import { Trash2 as DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import type { ITaskTodo } from "../types/task-todo";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { useDeleteSubtaskMutation, useUpdateSubtaskMutation } from "@/features/tasks/api/taskApi";
import { selectCurrentBoardId } from "@/store/slices/boardSlice";
import { useAppSelector } from "@/shared/hooks/redux";

interface ITaskSubtaskProps {
   taskId: string;
   colId: string;
   subtask: ITaskTodo;
}

export const TaskSubtask = ({ subtask, colId, taskId }: ITaskSubtaskProps) => {
   const boardId = useAppSelector(selectCurrentBoardId)
   const [localSubtask, setLocalSubtask] = useState(subtask);
   const [updateSubtask] = useUpdateSubtaskMutation();
   const [deleteSubtask] = useDeleteSubtaskMutation()

   const debouncedUpdate = useDebouncedCallback(
      async (updated: ITaskTodo) => {
         try {
            await updateSubtask({
               boardId,
               colId,
               taskId,
               subtaskId: updated.id,
               title: updated.title,
               completed: updated.completed,
            }).unwrap();
         } catch {
            toast.error("Ошибка при обновлении подзадачи");
            setLocalSubtask(subtask);
         }
      },
      500
   );

   const handleChange = (value?: string, type?: "title" | "completed") => {
      const updated: ITaskTodo =
         type === "completed"
            ? { ...localSubtask, completed: !localSubtask.completed }
            : { ...localSubtask, title: value ?? "" };

      setLocalSubtask(updated);
      debouncedUpdate(updated);
   };

   const handleDeleteSubtask = () => {
      try {
         deleteSubtask({
            boardId,
            colId,
            taskId,
            subtaskId: subtask.id
         }).unwrap()
      } catch (error) {
         toast.error('Не удалось удалить подзадачу')
      }
   }

   useEffect(() => {
      setLocalSubtask(subtask);
   }, [subtask]);

   return (
      <div className="relative flex gap-2 items-center group">
         <Checkbox
            checked={localSubtask.completed}
            onCheckedChange={() => handleChange(undefined, "completed")}
         />
         <ContentEditable
            html={localSubtask.title}
            onChange={e => handleChange(e.target.value, "title")}
            className={clsx(
               "text-lg outline-none cursor-text border-b border-transparent",
               "focus:border-blue-500",
               localSubtask.completed && "line-through text-muted-foreground"
            )}
         />
         <DeleteIcon onClick={handleDeleteSubtask} size={18} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
      </div>
   );
};


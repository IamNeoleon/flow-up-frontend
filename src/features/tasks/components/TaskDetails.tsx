import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { Trash2 as DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useAppDispatch } from "@/shared/hooks/redux";
import { SheetHeader, SheetTitle } from "@/shared/ui/shadcn/sheet";
import { taskApi, useCreateSubtaskMutation, useDeleteTaskMutation, useGetTaskByIdQuery, useUpdateTaskMutation } from "@/api/endpoints/taskApi";
import { getErrorMessage } from "@/shared/utils";
import { TaskPriority } from "./TaskPriority";
import { TaskDueDate } from "./TaskDueDate";
import { TaskSubtask } from "./TaskSubtask";
import { InlineSubtaskTextarea } from "./InlineSubtaskTextarea";
import type { IUpdateTaskDto } from "../types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/shared/ui/shadcn/alert-dialog"

interface ITaskDetailsProps {
   taskId: string;
   colId: string;
   onClose: () => void;
}

export const TaskDetails = ({ taskId, colId }: ITaskDetailsProps) => {
   const [deleteTask] = useDeleteTaskMutation();
   const { data: task, isLoading, isError, error } = useGetTaskByIdQuery({ colId, taskId });
   const [updateTask] = useUpdateTaskMutation();
   const [createSubtask] = useCreateSubtaskMutation();
   const dispatch = useAppDispatch()

   const [title, setTitle] = useState("");
   const [description, setDescription] = useState<string | undefined>("");
   const [openAlert, setOpenAlert] = useState(false);

   useEffect(() => {
      if (!task) {
         return
      }

      setTitle(task.name)
      setDescription(task.description)
   }, [task])

   if (isLoading) {
      return <div className="p-6">Загрузка...</div>;
   }

   if (isError) {
      return <div className="p-6">{getErrorMessage(error)}</div>;
   }

   if (!task) {
      return <div className="p-6">Не удалось получить задачу</div>;
   }

   const handleCreateSubtask = async (title: string) => {
      try {
         const createdSubtask = await createSubtask({
            colId: task.colId,
            taskId: task.id,
            title,
         }).unwrap()

         dispatch(
            taskApi.util.updateQueryData(
               "getTaskById",
               { colId, taskId },
               (draft) => {
                  draft.todos.push(createdSubtask)
               }
            )
         )
      } catch (error) {
         toast.error('Не удалось создЯать подзадачу')
      }
   };

   const handleUpdateDetails = (fields: Partial<IUpdateTaskDto>) => {
      updateTask({
         colId: task.colId,
         taskId: task.id,
         data: fields,
      });
   };

   const handleDeleteTask = () => {
      try {
         deleteTask({ colId: task.colId, taskId: task.id }).unwrap();
         toast.success("Задача удалена");
      } catch (error) {
         toast.error("Не удалось удалить задачу");
      }
   }

   return (
      <div className="py-14 px-16">
         <SheetHeader>
            <SheetTitle className="text-4xl">
               <ContentEditable
                  html={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={(e: React.FocusEvent<HTMLElement>) => {
                     const value = e.currentTarget.textContent?.trim() || ""
                     if (value !== task.name) {
                        handleUpdateDetails({ name: value })
                     }
                  }}
                  className="font-bold outline-none border-b border-transparent focus:border-blue-500"
               />
            </SheetTitle>
            <div className="flex gap-5">
               <TaskPriority
                  taskPriorityId={task.priorityId}
                  colId={task.colId}
                  onChange={p => {
                     handleUpdateDetails({ priorityId: p.id });
                  }}
               />
               <TaskDueDate
                  dueDate={task.dueDate}
                  setDueDate={d => {
                     handleUpdateDetails({ dueDate: d?.toISOString() });
                  }}
               />
            </div>
            <div className="mt-5">
               <h2 className="text-2xl font-medium mb-2">Описание</h2>
               <ContentEditable
                  html={description || ""}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={(e: React.FocusEvent<HTMLElement>) =>
                     handleUpdateDetails({
                        description: e.currentTarget.textContent || "",
                     })
                  }
                  className={clsx(
                     "text-lg outline-none border-b border-transparent pb-1",
                     "focus:border-blue-500",
                     !description && "text-muted-foreground"
                  )}
               />
            </div>
            <div className="mt-5">
               <h2 className="text-2xl font-medium mb-2">Подзадачи</h2>
               <div className="space-y-1">
                  {task.todos?.map(todo => (
                     <TaskSubtask
                        key={todo.id}
                        colId={task.colId}
                        taskId={task.id}
                        subtask={todo}
                     />
                  ))}
                  <InlineSubtaskTextarea onCreate={handleCreateSubtask} />
               </div>
            </div>
         </SheetHeader>
         <div onClick={() => setOpenAlert(true)} className="fixed bottom-20 right-20 z-10">
            <DeleteIcon size={48} className="hover:-translate-y-1 cursor-pointer transition-transform" />
         </div>
         <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Вы действительно хотите удалить задачу?</AlertDialogTitle>
                  <AlertDialogDescription>Это действие необратимо.</AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Нет</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTask}>Да</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
};

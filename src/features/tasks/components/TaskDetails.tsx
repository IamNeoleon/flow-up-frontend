import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { Trash2 as DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

import type { IUpdateTaskDto } from "../types";
import type { IUser } from "@/features/user/types/user";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { SheetHeader, SheetTitle } from "@/shared/ui/shadcn/sheet";
import { taskApi, useCreateSubtaskMutation, useDeleteTaskMutation, useGetTaskByIdQuery, useUpdateTaskMutation } from "@/features/tasks/api/taskApi";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { TaskPriority } from "./TaskPriority";
import { TaskDueDate } from "./TaskDueDate";
import { TaskSubtask } from "./TaskSubtask";
import { InlineSubtaskTextarea } from "./InlineSubtaskTextarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/shared/ui/shadcn/alert-dialog"
import { selectCurrentBoardId, selectPermissions } from "@/store/slices/boardSlice";
import { TaskAttachments } from "./TaskAttachments";
import { TaskAssignee } from "./TaskAssignee";
import { useTranslation } from "react-i18next";

interface ITaskDetailsProps {
   taskId: string;
   colId: string;
   onClose: () => void;
}

export const TaskDetails = ({ taskId, colId }: ITaskDetailsProps) => {
   const { t } = useTranslation()
   const permissions = useAppSelector(selectPermissions)
   const boardId = useAppSelector(selectCurrentBoardId)
   const [deleteTask] = useDeleteTaskMutation();
   const { data: task, isLoading, isError, error } = useGetTaskByIdQuery({ boardId, colId, taskId });
   const [updateTask] = useUpdateTaskMutation();
   const [createSubtask] = useCreateSubtaskMutation();
   const dispatch = useAppDispatch()

   const [title, setTitle] = useState("");
   const [description, setDescription] = useState<string | undefined>("");
   const [openAlert, setOpenAlert] = useState(false);

   useEffect(() => {
      if (!task) {
         return;
      }

      setTitle(task.name)
      setDescription(task.description)
   }, [task])

   if (isLoading) {
      return <div className="p-6">{t("common.loading")}</div>;
   }

   if (isError) {
      return <div className="p-6">{getErrorMessage(error)}</div>;
   }

   if (!task) {
      return <div className="p-6">{t("task.loadError")}</div>;
   }

   const handleCreateSubtask = async (title: string) => {
      try {
         const createdSubtask = await createSubtask({
            boardId,
            colId: task.colId,
            taskId: task.id,
            title,
         }).unwrap()

         dispatch(
            taskApi.util.updateQueryData(
               "getTaskById",
               { boardId, colId, taskId, },
               (draft) => {
                  draft.todos.push(createdSubtask)
               }
            )
         )
      } catch (error) {
         toast.error(t("task.subtaskCreateError"))
      }
   };

   const handleUpdateDetails = (fields: Partial<IUpdateTaskDto>, assignee?: Pick<IUser, 'id' | 'username' | 'avatar'> | null) => {
      updateTask({
         boardId,
         colId: task.colId,
         taskId: task.id,
         assignee: assignee,
         data: fields,
      });
   };

   const handleDeleteTask = async () => {
      try {
         await deleteTask({
            boardId,
            colId: task.colId,
            taskId: task.id
         }).unwrap();
         toast.success(t("task.deleteSuccess"));
      } catch (error) {
         toast.error(t("task.deleteError"));
      }
   }

   return (
      <div className="py-14 px-16">
         <SheetHeader>
            <SheetTitle className="text-4xl mb-3">
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
               <TaskAssignee taskAssignee={task.assignee}
                  handleAssigneeChange={assignee => {
                     handleUpdateDetails({ assigneeId: assignee?.id }, assignee);
                  }}
               />
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
               <h2 className="text-2xl font-medium mb-2">{t("task.description")}</h2>
               <ContentEditable
                  html={description || ""}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={(e: React.FocusEvent<HTMLElement>) => {
                     const next = (e.currentTarget.textContent ?? "").trim();
                     const prev = (task.description ?? "").trim();

                     if (next !== prev) {
                        handleUpdateDetails({ description: next });
                     }
                  }}
                  className={clsx(
                     "text-lg outline-none border-b border-transparent pb-1",
                     "focus:border-blue-500",
                     !description && "text-muted-foreground italic"
                  )}
               />
            </div>
            <div className="mt-5">
               <h2 className="text-2xl font-medium mb-2">{t("task.subtasksTitle")}</h2>
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
            <div className="mt-5">
               <h2 className="text-2xl font-medium mb-2">{t("task.attachmentsTitle")}</h2>
               <div className="">
                  <TaskAttachments attachments={task.attachments} boardId={boardId} colId={colId} taskId={taskId} />
               </div>
            </div>
         </SheetHeader>
         {
            permissions?.canDeleteTask && (
               <div onClick={() => setOpenAlert(true)} className="fixed bottom-20 right-20 z-10">
                  <DeleteIcon size={48} className="hover:-translate-y-1 cursor-pointer transition-transform" />
               </div>
            )
         }
         <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>{t("task.deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("task.deleteConfirmDescription")}</AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.no")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTask}>{t("common.yes")}</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
};

import { useEffect, useRef, useState } from "react";
import type { ITaskComment } from "../types/task-comment";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import { formatActivityTime } from "@/shared/lib/formate-activity-time";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { Pencil, Trash2, Ellipsis, ArrowUp, X } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/store/slices/userSlice";
import { useTranslation } from "react-i18next";
import { useDeleteCommentMutation, useEditCommentMutation } from "../api/taskApi";
import { toast } from "sonner";
import { useDeleteColumnMutation } from "@/services/column/api/columnApi";

interface IProps {
   comment: ITaskComment;
   boardId: string,
   colId: string,
   taskId: string
}

export const TaskCommentItem = ({ comment, boardId, colId, taskId }: IProps) => {
   const [editComment] = useEditCommentMutation()
   const [deleteComment] = useDeleteCommentMutation()

   const { t } = useTranslation()

   const user = useAppSelector(selectUser);
   const isMyCom = comment.authorId === user?.id;

   const [isEditing, setIsEditing] = useState(false);
   const [value, setValue] = useState(comment.content);

   const textareaRef = useRef<HTMLTextAreaElement | null>(null);

   const isUpdated = comment.createdAt !== comment.updatedAt

   const handleEditComment = async () => {
      try {
         await editComment({
            boardId,
            taskId,
            colId,
            comId: comment.id,
            content: value
         }).unwrap()
      } catch (error) {
         toast.error('Error')
      }
   }

   const handleDeleteComment = async () => {
      try {
         await deleteComment({
            boardId,
            taskId,
            colId,
            comId: comment.id,
         }).unwrap()
      } catch (error) {
         toast.error('Error')
      }
   }

   const handleInput = () => {
      const el = textareaRef.current;
      if (!el) return;

      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter" || e.shiftKey) return;

      e.preventDefault();
      saveEdit();
   };

   const startEdit = () => {
      setIsEditing(true);
      setValue(comment.content);
   };

   const cancelEdit = () => {
      setIsEditing(false);
      setValue(comment.content);
   };

   const saveEdit = async () => {
      if (!value.trim()) return;

      if (value.trim() === comment.content.trim()) {
         setIsEditing(false);
         return;
      }

      setIsEditing(false);

      handleEditComment()
   };

   useEffect(() => {
      if (!isEditing) setValue(comment.content);
   }, [comment.content, isEditing]);

   useEffect(() => {
      if (!isEditing) return;
      const el = textareaRef.current;
      if (!el) return;

      el.focus();

      el.setSelectionRange(el.value.length, el.value.length);

      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
   }, [isEditing]);

   return (
      <div className="flex gap-2 border-b py-2">
         <div className="pt-1 shrink-0">
            <Avatar className="w-8 h-8">
               <AvatarImage src={comment.author.avatar} />
               <AvatarFallback>{getUserInitials(comment.author.username)}</AvatarFallback>
            </Avatar>
         </div>

         <div className="w-full min-w-0">
            <div className="flex items-center justify-between gap-2">
               <div className="flex items-center gap-2 min-w-0">
                  <div className="font-medium text-sm truncate">
                     {comment.author.username}
                  </div>
                  <div className="italic text-sm text-muted-foreground shrink-0">
                     {
                        isUpdated ? (
                           <span className="lowercase">{formatActivityTime(comment.updatedAt)} ({t('common.edited')})</span>
                        ) : (
                           formatActivityTime(comment.createdAt)
                        )
                     }
                  </div>
               </div>
               {isMyCom && (
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <button className="shrink-0">
                           <Ellipsis />
                        </button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="-translate-x-[50px]">
                        <DropdownMenuItem
                           className="cursor-pointer font-medium flex items-center gap-1"
                           onClick={startEdit}
                        >
                           <span>{t('common.edit')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className="cursor-pointer font-medium flex items-center gap-1 text-red-700"
                           onClick={handleDeleteComment}
                        >
                           <span>{t('common.delete')}</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               )}
            </div>
            {!isEditing ? (
               <div className="text-sm whitespace-pre-wrap wrap-break-word">
                  {comment.content}
               </div>
            ) : (
               <div className="relative pb-6">
                  <textarea
                     style={{ fontSize: "14px" }}
                     ref={textareaRef}
                     rows={1}
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     onInput={handleInput}
                     onKeyDown={handleKeyDown}
                     className="w-full bg-transparent resize-none
                        border-0
                        px-0
                        text-sm
                        focus:outline-none
                        focus:ring-0
                        max-h-[250px]
                        overflow-y-auto
                        scrollbar-none
                     "
                  />

                  <div className="flex absolute right-0 bottom-1 gap-1">
                     <button
                        onClick={cancelEdit}
                        className="w-6 h-6 relative hover:bg-red-700/80 bg-red-700 text-muted-foreground rounded-full"
                     >
                        <X size={16} color="#fff" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                     </button>
                     <button
                        onClick={saveEdit}
                        className="w-6 h-6 bg-primary hover:bg-primary/80 relative rounded-full "
                     >
                        <ArrowUp
                           color="#fff"
                           size={16}
                           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useAddCommentMutation } from "../api/taskApi";
import { toast } from "sonner";
import { selectUser } from "@/store/slices/userSlice";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import { useTranslation } from "react-i18next";

interface ITaskCommentsAddProps {
   boardId: string,
   colId: string,
   taskId: string
}

export const TaskCommentsAdd = ({ boardId, colId, taskId }: ITaskCommentsAddProps) => {
   const { t } = useTranslation()

   const [addComment, { isLoading }] = useAddCommentMutation()

   const user = useAppSelector(selectUser)

   const textareaRef = useRef<HTMLTextAreaElement | null>(null)

   const [value, setValue] = useState('')

   const handleInput = () => {
      const el = textareaRef.current
      if (!el) return

      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 120) + "px"
   }

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter" || e.shiftKey) return

      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
   }

   const resetTextareaHeight = () => {
      const el = textareaRef.current
      if (!el) return

      el.style.height = "auto"
   }

   const onAddComment = (e: React.FormEvent) => {
      e.preventDefault()

      if (!value.trim()) return

      resetTextareaHeight()

      try {
         addComment({
            boardId,
            colId,
            taskId,
            content: value
         }).unwrap()

         toast.success('success')
      } catch (error) {
         toast.error('error')
      }

      setValue("")
   }

   return (
      <>
         <form onSubmit={onAddComment} className="mt-4 flex gap-3 items-start border-b">
            <div className="pt-1">
               <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{getUserInitials(user?.username)}</AvatarFallback>
               </Avatar>
            </div>
            <div className="w-full relative pb-5">
               <textarea
                  id="comments-textarea"
                  name="comments-textarea"
                  style={{ fontSize: "14px" }}
                  ref={textareaRef}
                  rows={1}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onInput={handleInput}
                  placeholder={t('comments.addComment')}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent resize-none
                     border-0
                     px-0
                     py-1
                     text-sm
                     focus:outline-none
                     focus:ring-0
                     placeholder:text-muted-foreground
                     max-h-[250px]
                     overflow-y-auto
                     scrollbar-none
                     placeholder:text-sm
                  "
               />
               <button disabled={isLoading} type="submit" className="w-6 h-6 bg-primary rounded-full absolute right-0 bottom-2 transition-colors hover:bg-primary/80">
                  <ArrowUp color="#fff" size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </button>
            </div>
         </form>
      </>
   );
};

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { useAddCommentMutation } from "../api/taskApi";
import { selectUser } from "@/store/slices/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import { useTranslation } from "react-i18next";
import { TaskCommentAddMentions } from "./TaskCommentAddMentions";

interface ITaskCommentsAddProps {
   boardId: string;
   colId: string;
   taskId: string;
}

export const TaskCommentsAdd = ({ boardId, colId, taskId }: ITaskCommentsAddProps) => {
   const { t } = useTranslation();
   const [addComment, { isLoading }] = useAddCommentMutation();
   const user = useAppSelector(selectUser);

   const textareaRef = useRef<HTMLTextAreaElement | null>(null);

   const [value, setValue] = useState("");
   const [cursorPos, setCursorPos] = useState(0);

   const [mentionQuery, setMentionQuery] = useState<string | null>(null);
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [usernames, setUsernames] = useState<string[]>([]);

   const MIN_H_TEXTAREA = 40;
   const MAX_H_TEXTAREA = 120;

   const resize = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;

      el.style.height = "auto";

      const next = Math.min(el.scrollHeight, MAX_H_TEXTAREA);
      el.style.height = `${Math.max(next, MIN_H_TEXTAREA)}px`;

      el.style.overflowY = el.scrollHeight > MAX_H_TEXTAREA ? "auto" : "hidden";
   }, []);


   useEffect(() => {
      requestAnimationFrame(resize);
   }, [value, resize]);

   const closeMentions = () => {
      setMentionQuery(null);
      setUsernames([]);
      setSelectedIndex(0);
   };

   const handleMentionInsert = (username: string) => {
      const el = textareaRef.current;

      const insertText = `@${username} `;

      const beforeRaw = value.slice(0, cursorPos);
      const after = value.slice(cursorPos);

      const replacedBefore = beforeRaw.replace(/@[\w]{0,20}$/, insertText);
      const newText = replacedBefore + after;

      setValue(newText);
      closeMentions();

      requestAnimationFrame(() => {
         if (!el) return;
         el.focus();

         const newCursor = replacedBefore.length;
         el.setSelectionRange(newCursor, newCursor);
         setCursorPos(newCursor);
      });
   };

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const cursor = e.target.selectionStart ?? 0;

      setValue(val);
      setCursorPos(cursor);

      const sliced = val.slice(0, cursor);

      const match = sliced.match(/(?:^|\s)@([\w]{0,20})$/);

      const q = match ? match[1] : null;
      setMentionQuery(q);

      if (q === null) {
         setUsernames([]);
         setSelectedIndex(0);
      } else {
         setSelectedIndex(0);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMentionsOpen = mentionQuery !== null && usernames.length > 0;

      if (isMentionsOpen) {
         if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, usernames.length - 1));
            return;
         }

         if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
            return;
         }

         if (e.key === "Enter") {
            e.preventDefault();
            const username = usernames[selectedIndex];
            if (username) handleMentionInsert(username);
            return;
         }

         if (e.key === "Escape") {
            e.preventDefault();
            closeMentions();
            return;
         }
      }

      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         e.currentTarget.form?.requestSubmit();
      }
   };

   const onAddComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim()) return;

      try {
         await addComment({ boardId, colId, taskId, content: value }).unwrap();
         toast.success("Comment added");
         setValue("");
         setCursorPos(0);
         closeMentions();
      } catch {
         toast.error("Failed to add comment");
      }
   };

   const onListChange = useCallback((list: string[]) => {
      setUsernames(list);
   }, []);

   return (
      <form onSubmit={onAddComment} className="mt-4 flex gap-3 items-start border-b relative">
         <div className="pt-1">
            <Avatar className="w-8 h-8">
               <AvatarImage src={user?.avatar} />
               <AvatarFallback>{getUserInitials(user?.username)}</AvatarFallback>
            </Avatar>
         </div>

         <div className="w-full relative pb-5">

            <div className="relative">
               <textarea
                  id="comments-textarea"
                  name="comments-textarea"
                  ref={textareaRef}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t("comments.addComment")}
                  style={{ fontSize: "14px", height: MIN_H_TEXTAREA }}
                  className="w-full bg-transparent resize-none border-0 px-0 py-1
                     focus:outline-none focus:ring-0 placeholder:text-muted-foreground
                     overflow-y-hidden scrollbar-none placeholder:text-sm
                  "
               />

               <TaskCommentAddMentions
                  mentionQuery={mentionQuery}
                  onPick={handleMentionInsert}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  onListChange={onListChange}
               />
            </div>

            <button
               disabled={isLoading}
               type="submit"
               className="w-6 h-6 bg-primary rounded-full absolute right-0 bottom-2 transition-colors hover:bg-primary/80"
            >
               <ArrowUp
                  color="#fff"
                  size={16}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
               />
            </button>
         </div>
      </form>
   );
};

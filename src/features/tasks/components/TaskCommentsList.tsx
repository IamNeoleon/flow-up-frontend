import clsx from "clsx";
import { useGetCommentsQuery } from "../api/taskApi";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { TaskCommentItem } from "./TaskCommentItem";

interface ITaskCommentsListProps {
   boardId: string,
   colId: string,
   taskId: string
}

export const TaskCommentsList = ({ boardId, colId, taskId }: ITaskCommentsListProps) => {
   const { data: comments, isLoading, isError } = useGetCommentsQuery({ boardId, colId, taskId })

   console.log(comments);


   return (
      <div className={clsx("flex flex-col gap-1 max-h-[500px] overflow-y-auto", isLoading && 'items-center justify-center')}>
         {
            isLoading ? (
               <Spinner />
            ) : (
               !isError ? (
                  comments?.map(com => (
                     <TaskCommentItem
                        key={com.id}
                        comment={com}
                        boardId={boardId}
                        colId={colId}
                        taskId={taskId}
                     />
                  ))
               ) : (
                  <div>error</div>
               )
            )
         }
         {/* <div className="flex gap-2 border-b py-2">
            <div className="pt-1">
               <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">Alex Mason</div>
                  <div className="italic text-sm text-muted-foreground">4 hours ago</div>
               </div>
               <div className="text-sm">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste consequatur velit aliquam qui fugit accusantium pariatur vero fuga neque, suscipit eveniet iure, cum omnis temporibus voluptates harum? Laboriosam, corporis ab?
               </div>
            </div>
         </div>
         <div className="flex gap-2 border-b py-2">
            <div className="pt-1">
               <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">Alex Mason</div>
                  <div className="italic text-sm text-muted-foreground">4 hours ago</div>
               </div>
               <div className="text-sm">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste consequatur velit aliquam qui fugit accusantium pariatur vero fuga neque, suscipit eveniet iure, cum omnis temporibus voluptates harum? Laboriosam, corporis ab?
               </div>
            </div>
         </div> */}
      </div>
   );
};

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
      </div>
   );
};

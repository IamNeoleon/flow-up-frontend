import { useGetBoardMembersQuery } from "@/services/board/api/boardApi";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { BoardMember } from "./BoardMember";

interface IBoardMembersProps {
   workspaceId: string,
   boardId: string,
   close: () => void
}

export const BoardMembers = ({ workspaceId, boardId }: IBoardMembersProps) => {
   const { data: members, isLoading } = useGetBoardMembersQuery({ workspaceId, boardId })

   return (
      <>
         <div>
            {
               isLoading ? (
                  <Spinner className="mx-auto" />
               ) : (
                  members?.map(member => (
                     <BoardMember key={member.userId} workspaceId={workspaceId} boardId={boardId} member={member} />
                  ))
               )
            }
         </div>
      </>
   );
};

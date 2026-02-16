import React from "react";
import { BoardHeader } from "@/services/board/components/BoardHeader";
import { KanbanBoard } from "./KanbanBoard/ui/KanbanBoard";
import type { IWorkspace } from "@/services/workspace/types/workspace";

interface BoardViewProps {
   board: {
      id: string;
      name: string;
      description?: string;
      workspaceId: string
   };
   currentWorkspace: IWorkspace | null
}

export const BoardView = React.memo(({ board, currentWorkspace }: BoardViewProps) => {
   return (
      <>
         <BoardHeader
            workspaceId={board.workspaceId}
            boardId={board.id}
            boardTitle={board.name}
            boardDescription={board.description ?? ''}
            currentWorkspace={currentWorkspace}
         />
         <KanbanBoard boardId={board.id} />
      </>
   );
});

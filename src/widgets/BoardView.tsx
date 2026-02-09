import React from "react";
import { BoardHeader } from "@/services/board/components/BoardHeader";
import { ColumnList } from "@/services/column/components/ColumnList";
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
      <div className="px-8 py-5">
         <BoardHeader
            workspaceId={board.workspaceId}
            boardId={board.id}
            boardTitle={board.name}
            boardDescription={board.description ?? ''}
            currentWorkspace={currentWorkspace}
         />
         <ColumnList boardId={board.id} />
      </div>
   );
});

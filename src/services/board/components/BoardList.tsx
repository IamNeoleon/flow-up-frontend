import { type FC } from "react";
import { Link } from "react-router";
import { BoardCard } from "@/shared/ui/BoardCard";
import type { IBoard } from "../types/board";
import { useTranslation } from "react-i18next";

interface IBoardListProps {
   boards: IBoard[];
   workspaceId: string;
}

export const BoardList: FC<IBoardListProps> = ({ boards, workspaceId }) => {
   const { t } = useTranslation();

   const content = (() => {
      if (boards.length === 0) {
         return (
            <div className="italic py-10 w-full text-center text-lg">
               {t("board.boardEmpty")}
            </div>
         )
      }

      return (
         boards.map((board) => (
            <Link
               key={board.id}
               to={`/workspaces/${workspaceId}/boards/${board.id}`}
            >
               <BoardCard
                  id={board.id}
                  title={board.name}
                  updatedAt={board.updatedAt}
               />
            </Link>
         ))
      )
   })()

   return (
      <>
         <div className="flex gap-5 flex-wrap">
            {content}
         </div>
      </>
   );
};

import { useGetBoardQuery } from "@/services/board/api/boardApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useBoardPermissions } from "@/shared/hooks/use-board-permissions";
import { selectUser } from "@/store/slices/userSlice";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { setCurrentBoardId, setPermissions } from "@/store/slices/boardSlice";
import { useCurrentWorkspace } from "@/shared/hooks/use-current-workspace";
import { useWsBoardEvents } from "@/shared/lib/use-ws-board-events";
import { useTranslation } from "react-i18next";
import { BoardView } from "@/widgets/BoardView";
import { useWs } from "@/app/providers/WsProvider";

const BoardPage = () => {
   const dispatch = useAppDispatch();
   const { boardId, workspaceId } = useParams();
   const { data: board, isError } = useGetBoardQuery(
      boardId && workspaceId ? { boardId, workspaceId } : skipToken,
   );
   const { socket, joinBoard, leaveBoard, status } = useWs();
   const { t } = useTranslation();
   const { currentWorkspace } = useCurrentWorkspace(workspaceId);
   const user = useAppSelector(selectUser);

   const {
      onTaskCreated,
      onTaskDeleted,
      onTaskUpdated,
      onTaskCommented,
      onTaskMoved,
   } = useWsBoardEvents(user?.id);

   const { permissions, role } = useBoardPermissions(
      workspaceId ?? "",
      boardId ?? "",
      user?.id ?? "",
   );

   useEffect(() => {
      if (boardId) {
         dispatch(setCurrentBoardId(boardId));
      }
   }, [boardId, dispatch]);

   useEffect(() => {
      dispatch(setPermissions(permissions));
   }, [permissions, role, dispatch]);

   useEffect(() => {
      if (status !== "connected" || !boardId) return;

      joinBoard(boardId);

      return () => leaveBoard(boardId);
   }, [status, boardId, joinBoard, leaveBoard]);

   useEffect(() => {
      if (!socket || !user) return;

      socket.on("TASK_CREATED", onTaskCreated);
      socket.on("TASK_UPDATED", onTaskUpdated);
      socket.on("TASK_DELETED", onTaskDeleted);
      socket.on("TASK_COMMENTED", onTaskCommented);
      socket.on("TASK_MOVED", onTaskMoved);

      return () => {
         socket.off("TASK_CREATED", onTaskCreated);
         socket.off("TASK_UPDATED", onTaskUpdated);
         socket.off("TASK_DELETED", onTaskDeleted);
         socket.off("TASK_COMMENTED", onTaskCommented);
         socket.off("TASK_MOVED", onTaskMoved);
      };
   }, [
      socket,
      user,
      onTaskCommented,
      onTaskCreated,
      onTaskDeleted,
      onTaskMoved,
      onTaskUpdated,
   ]);

   if (isError || !board) {
      return <div>{t("errors.boardLoad")}</div>;
   }

   return (
      <>
         <BoardView board={board} currentWorkspace={currentWorkspace} />
         <Outlet />
      </>
   );
};

export default BoardPage;

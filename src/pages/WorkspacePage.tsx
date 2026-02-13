import { useEffect } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import { useGetWorkspaceQuery } from "@/services/workspace/api/workspaceApi";
import { WorkspaceHeader } from "@/services/workspace/components/WorkspaceHeader";
import { WorkspaceStats } from "@/services/workspace/components/WorkspaceStat";
import { BoardList } from "@/services/board/components/BoardList";
import { WorkspaceRecent } from "@/services/workspace/components/WorkspaceRecent";
import { WorkspaceMembers } from "@/services/workspace/components/WorkspaceMembers";
import { useWorkspacePermissions } from "@/shared/hooks/use-workspace-permissions";
import { useWs } from "@/app/providers/WsProvider";
import { useUpdateWorkspaceActivity } from "@/shared/hooks/use-update-workspace-activity";

const WorkspacePage = () => {
   const { t } = useTranslation();

   const { workspaceId } = useParams();

   const { data: workspace } = useGetWorkspaceQuery(workspaceId ?? skipToken);
   const { permissions } = useWorkspacePermissions(workspaceId);

   const { socket, status, joinWorkspace, leaveWorkspace } = useWs();

   const { handleUpdateWorkspaceActivity } =
      useUpdateWorkspaceActivity(workspaceId);

   useEffect(() => {
      if (!socket) return;

      socket.on("WORKSPACE_UPDATED", handleUpdateWorkspaceActivity);

      return () => {
         socket.off("WORKSPACE_UPDATED", handleUpdateWorkspaceActivity);
      };
   }, [socket, handleUpdateWorkspaceActivity]);

   useEffect(() => {
      if (status !== "connected" || !workspaceId) return;

      joinWorkspace(workspaceId);

      return () => leaveWorkspace(workspaceId);
   }, [status, workspaceId, joinWorkspace, leaveWorkspace]);

   if (!workspace) {
      return <div>{t("errors.workspaceNotFound")}</div>;
   }

   return (
      <>
         <WorkspaceHeader workspace={workspace} permissions={permissions} />
         <WorkspaceStats workspaceId={workspace.id} />
         <div className="pb-10 border-b">
            <h2 className="text-xl font-medium mb-5">{t("board.listTitle")}</h2>
            <BoardList boards={workspace.boards} workspaceId={workspace.id} />
         </div>
         <div className="pt-5 flex gap-10 max-2xl:flex-col-reverse">
            <div className="flex-auto">
               <WorkspaceRecent workspaceId={workspace.id} />
            </div>
            <div className="flex-[0_0_30%]">
               <WorkspaceMembers
                  permissions={permissions}
                  workspaceId={workspace.id}
               />
            </div>
         </div>
      </>
   );
};

export default WorkspacePage;

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
import { Button } from "@/shared/ui/shadcn/button";
import { ServerCrash, FolderX } from "lucide-react";
import { Spinner } from "@/shared/ui/shadcn/spinner";

const WorkspacePage = () => {
   const { t } = useTranslation();
   const { workspaceId } = useParams();
   const navigate = useNavigate()

   const { data: workspace, isError, isLoading, refetch } = useGetWorkspaceQuery(workspaceId ?? skipToken);
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

   if (isLoading) {
      return (
         <div className="h-full flex flex-col justify-center items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
               <Spinner className="size-6" />
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="h-full flex flex-col justify-center items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
               <ServerCrash className="w-7 h-7 text-destructive" />
            </div>
            <div>
               <h2 className="text-lg font-semibold">{t("workspace.workspaceByIdError")}</h2>
               <p className="text-sm text-muted-foreground mt-1">
                  {t("common.tryAgainLater")}
               </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
               {t("common.tryAgain")}
            </Button>
         </div>
      )
   }

   if (!workspace) {
      return (
         <div className="h-full flex flex-col justify-center items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
               <FolderX className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
               <h2 className="text-lg font-semibold">{t("errors.workspaceNotFound")}</h2>
               <p className="text-sm text-muted-foreground mt-1">
                  {t("workspace.workspaceNotFoundDescription")}
               </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
               {t("common.goBack")}
            </Button>
         </div>
      )
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

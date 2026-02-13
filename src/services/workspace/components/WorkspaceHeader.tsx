import { useModal } from "@/app/providers/ModalProvider";
import { CreateBoard } from "@/services/board/components/CreateBoard";

import { Button } from "@/shared/ui/shadcn/button";
import { Settings, Plus } from "lucide-react";
import { WorkspaceSettingsModal } from "./WorkspaceSettings";
import type { IWorkspace } from "../types/workspace";
import { useGetIcon } from "@/shared/hooks/use-get-icon";
import clsx from "clsx";
import type { IWorkspacePermission } from "../types/workspace-permission";
import { useTranslation } from "react-i18next";
import { useLeaveWorkspaceMutation } from "../api/workspaceApi";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/get-error-message";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AlertDialogBlock } from "@/shared/ui/AlertDialogBlock";
import { useNavigate } from "react-router";

interface IWorkspaceHeaderProps {
   workspace: IWorkspace;
   permissions: IWorkspacePermission;
}

export const WorkspaceHeader = ({
   workspace,
   permissions,
}: IWorkspaceHeaderProps) => {
   const [leaveWorkspace] = useLeaveWorkspaceMutation();

   const navigate = useNavigate();

   const { t } = useTranslation();
   const workspaceStatus = workspace.isArchived ? "ARCHIVED" : "ACTIVE";
   const { open, close } = useModal();
   const Icon = useGetIcon(workspace.icon);

   const handleCreateBoard = () => {
      open({
         title: t("board.createNew"),
         description: "",
         content: <CreateBoard close={close} workspaceId={workspace.id} />,
      });
   };

   const handleOpenSettings = () => {
      open({
         title: t("workspace.settingsTitle"),
         description: "",
         content: (
            <WorkspaceSettingsModal
               workspaceId={workspace.id}
               workspaceName={workspace.name}
               isArchived={workspace.isArchived}
               icon={workspace.icon}
               close={close}
            />
         ),
      });
   };

   const handleLeaveWorkspace = async () => {
      try {
         await leaveWorkspace(workspace.id).unwrap();

         toast.success(t("workspace.leaveSuccess"));

         navigate("/");
      } catch (error) {
         toast.error(getErrorMessage(error as FetchBaseQueryError));
      }
   };

   return (
      <>
         <div className="mb-4 w-full pb-2 border-b">
            <div className="flex justify-between items-center mb-3 max-lg:flex-col max-lg:items-start max-lg:justify-start max-lg:gap-2">
               <div>
                  <div className="flex items-center gap-2 mb-3 max-lg:mb-1">
                     <Icon size={28} />
                     <h1 className="text-3xl capitalize">{workspace.name}</h1>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-lg font-medium">
                        {t("workspace.statusLabel")}:
                     </span>

                     <div
                        className={clsx(
                           "px-2 py-1 rounded-md text-sm font-semibold inline-flex items-center",
                           "border",
                           workspace.isArchived
                              ? "bg-muted text-muted-foreground border-border"
                              : "bg-accent text-primary border-primary/20",
                        )}
                     >
                        {t(`workspace.status.${workspaceStatus.toLowerCase()}`)}
                     </div>
                  </div>
               </div>
               <div className="flex gap-3 max-sm:flex-col max-sm:w-full">
                  <AlertDialogBlock
                     title={t("workspace.leaveWarningTitle")}
                     description={t("workspace.leaveWarningDescription")}
                     cancelLabel={t("common.cancel")}
                     actionLabel={t("common.yes")}
                     onClickAction={handleLeaveWorkspace}
                  >
                     <Button className="bg-red-700 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-400 transition-colors">
                        {t(`workspace.leave`)}
                     </Button>
                  </AlertDialogBlock>
                  {permissions.canEditWorkspace && (
                     <Button
                        onClick={handleOpenSettings}
                        variant="outline"
                        className="flex items-center gap-2"
                     >
                        <Settings />
                        {t("sidebar.settings")}
                     </Button>
                  )}
                  {permissions.canCreateBoard && (
                     <Button
                        onClick={handleCreateBoard}
                        className="flex items-center gap-2 "
                     >
                        <Plus />
                        {t("board.createNew")}
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

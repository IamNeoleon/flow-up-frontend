import { useModal } from "@/app/providers/ModalProvider";
import { CreateBoard } from "@/features/board/components/CreateBoard";

import { Button } from "@/shared/ui/shadcn/button";
import { Settings, Plus } from "lucide-react";
import { WorkspaceSettingsModal } from "./WorkspaceSettings";
import type { IWorkspace } from "../types/workspace";
import { useGetIcon } from "@/shared/hooks/use-get-icon";
import { WORKSPACE_STATUSES } from "../constants/workspace-statuses";
import clsx from "clsx";
import type { IWorkspacePermission } from "../types/workspace-permission";

interface IWorkspaceHeaderProps {
   workspace: IWorkspace;
   permissions: IWorkspacePermission
}

export const WorkspaceHeader = ({ workspace, permissions }: IWorkspaceHeaderProps) => {
   const workspaceStatus = workspace.isArchived ? 'ARCHIVED' : 'ACTIVE';
   const { open, close } = useModal()
   const Icon = useGetIcon(workspace.icon);

   const handleCreateBoard = () => {
      open({
         title: 'Создать новую доску',
         description: "",
         content: <CreateBoard close={close} workspaceId={workspace.id} />
      })
   }

   const handleOpenSettings = () => {
      open({
         title: 'Настройки воркспейса',
         description: "",
         content: <WorkspaceSettingsModal
            workspaceId={workspace.id}
            workspaceName={workspace.name}
            isArchived={workspace.isArchived}
            icon={workspace.icon}
            close={close}
         />
      })
   }

   return (
      <>
         <div className='mb-4 w-full pb-2 border-b'>
            <div className="flex justify-between items-center mb-3">
               <div>
                  <div className="flex items-center gap-2 mb-3">
                     <Icon size={28} />
                     <h1 className='text-3xl capitalize'>
                        {workspace.name}
                     </h1>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-lg font-medium">Статус:</span>
                     <div className={clsx(
                        "px-2 py-1 rounded-md text-sm font-semibold inline-block",
                        workspace.isArchived
                           ? "bg-gray-300 text-gray-600"
                           : "bg-emerald-300 text-emerald-900"
                     )}>
                        {WORKSPACE_STATUSES[workspaceStatus]}
                     </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  {
                     permissions.canEditWorkspace && (
                        <Button onClick={handleOpenSettings} variant="outline" size="sm" className="flex items-center gap-2">
                           <Settings />
                           Настройки
                        </Button>
                     )
                  }
                  {
                     permissions.canCreateBoard && (
                        <Button onClick={handleCreateBoard} variant="default" size="sm" className="flex items-center gap-2 ">
                           <Plus />
                           Создать новую доску
                        </Button>
                     )
                  }
               </div>
            </div>
         </div>
      </>
   );
};

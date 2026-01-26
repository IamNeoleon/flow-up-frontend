import clsx from "clsx";
import { UserPlus } from "lucide-react";
import { useGetWorkspaceMembersQuery } from "@/features/workspace/api/workspaceApi";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { useModal } from "@/app/providers/ModalProvider";
import { AddMember } from "./AddMember";
import { WorkspaceMember } from "./WorkspaceMember";
import type { IWorkspacePermission } from "../types/workspace-permission";
import { useTranslation } from "react-i18next";

interface IWorkspaceMembersProps {
   workspaceId: string,
   permissions: IWorkspacePermission
}

export const WorkspaceMembers = ({ workspaceId, permissions }: IWorkspaceMembersProps) => {
   const { t } = useTranslation()
   const { data: members, isLoading, isError, error } = useGetWorkspaceMembersQuery(workspaceId)
   const err = getErrorMessage(error)
   const { open, close } = useModal()
   const handleAddMember = () => {
      open({
         title: t("workspace.addMemberTitle"),
         description: t("workspace.addMemberDescription"),
         content: <AddMember close={close} workspaceId={workspaceId} />
      })
   }

   const sortedMembers = [...(members ?? [])].sort((a, b) => {
      if (a.role === "OWNER") return -1;
      if (b.role === "OWNER") return 1;
      return 0;
   });

   return (
      <>
         <div className="mb-5 flex justify-between items-center">
            <h2 className="text-xl font-medium capitalize">
               {t("workspace.membersTitle")} ({members?.length ?? 0})
            </h2>
            {
               permissions.canInviteMember && (
                  <UserPlus size={21} onClick={handleAddMember} className="cursor-pointer" />
               )
            }
         </div>
         <div className="border rounded-lg py-2 px-5">
            <div className={clsx("flex flex-col gap-4 min-h-[250px]", { 'justify-center items-center': members?.length === 0 })}>
               {
                  isLoading ? (
                     <Spinner className="size-7" />
                  ) : (
                     !isError ? (
                        <>
                           {
                              members && members.length > 0 ? sortedMembers.map(member => (
                                 <WorkspaceMember key={member.id} workspaceId={workspaceId} permissions={permissions} member={member} />
                              )) : (
                                 <div className="italic">
                                    {t("workspace.membersEmpty")}
                                 </div>
                              )
                           }
                        </>
                     ) : (
                        <div className="text-red-500 text-center">
                           {t("workspace.membersLoadError", { error: err })}
                        </div>
                     )
                  )
               }
            </div>
         </div >
      </>
   );
};

import clsx from "clsx";
import { UserPlus } from "lucide-react";
import { useGetWorkspaceMembersQuery } from "@/features/workspace/api/workspaceApi";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { useModal } from "@/app/providers/ModalProvider";
import { AddMember } from "./AddMember";
import { WorkspaceMember } from "./WorkspaceMember";
import type { IWorkspacePermission } from "../types/workspace-permission";

interface IWorkspaceMembersProps {
   workspaceId: string,
   permissions: IWorkspacePermission
}

export const WorkspaceMembers = ({ workspaceId, permissions }: IWorkspaceMembersProps) => {
   const { data: members, isLoading, isError, error } = useGetWorkspaceMembersQuery(workspaceId)
   const err = getErrorMessage(error)
   const { open, close } = useModal()
   const handleAddMember = () => {
      open({
         title: 'Добавить участника в воркспейс',
         description: "Создайте уникальную ссылку-приглашение и отправьте ее тем, кого нужно добавить.",
         content: <AddMember close={close} workspaceId={workspaceId} />
      })
   }

   return (
      <>
         <div className="mb-5 flex justify-between items-center">
            <h2 className="text-xl font-medium capitalize">Участники ({members?.length})</h2>
            {
               permissions.canInviteMember && (
                  <UserPlus size={21} onClick={handleAddMember} className="cursor-pointer" />
               )
            }
         </div>
         <div className="bg-[#171717] rounded-lg py-2 px-5">
            <div className={clsx("flex flex-col gap-4 min-h-[250px]", { 'justify-center items-center': members?.length === 0 })}>
               {
                  isLoading ? (
                     <Spinner className="size-7" />
                  ) : (
                     !isError ? (
                        <>
                           {
                              members && members.length > 0 ? members.map(member => (
                                 <WorkspaceMember key={member.id} workspaceId={workspaceId} permissions={permissions} member={member} />
                              )) : (
                                 <div className="italic">
                                    Кроме вас, тут никого нет
                                 </div>
                              )
                           }
                        </>
                     ) : (
                        <div className="text-red-500 text-center">Прозошла ошибка при загрузке участников: {err}</div>
                     )
                  )
               }
            </div>
         </div >
      </>
   );
};

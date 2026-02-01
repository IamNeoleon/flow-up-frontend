import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/shared/ui/shadcn/dropdown-menu"
import { Ellipsis } from "lucide-react";
import { useModal } from "@/app/providers/ModalProvider";
import { ChangeRoleMember } from "./ChangeRoleMember";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/shared/ui/shadcn/alert-dialog"
import { useState } from "react";
import { useDeleteMemberMutation } from "@/services/workspace/api/workspaceApi";
import { toast } from "sonner";
import type { IWorkspaceMember } from "../types/workspace-member";
import type { IWorkspacePermission } from "../types/workspace-permission";
import { useTranslation } from "react-i18next";
import { UserInfo } from "@/shared/ui/UserInfo";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser } from "@/store/slices/userSlice";

interface IWorkspaceMemberProps {
   member: IWorkspaceMember
   permissions: IWorkspacePermission,
   workspaceId: string
}

export const WorkspaceMember = ({ member, permissions, workspaceId }: IWorkspaceMemberProps) => {
   const { t } = useTranslation()
   const { open, close } = useModal()
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
   const [deleteMember] = useDeleteMemberMutation()
   const currentUser = useAppSelector(selectUser)

   const handleChangeRole = () => {
      open({
         title: t("workspace.changeRoleTitle"),
         description: "",
         content: <ChangeRoleMember workspaceId={workspaceId} member={member} close={close} />
      })
   }

   const handleDeleteMember = async () => {
      try {
         await deleteMember({ workspaceId, userId: member.user.id }).unwrap();

         toast.success(t("workspace.memberDeletedSuccess"));
      } catch (error) {
         toast.error(t("workspace.memberDeletedError"));
      }

      setOpenDeleteAlert(false);
   }

   return (
      <>
         <div key={member.id} className="flex w-full items-center justify-between border-b px-2 py-2">
            <UserInfo
               userId={member.user.id}
               role={member.role}
               username={member.user.username}
               userAvatar={member.user.avatar}
            />
            {permissions.canChangeRole && currentUser?.id !== member.user.id && (
               <>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Ellipsis className="cursor-pointer" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="-translate-x-[50px]">
                        <DropdownMenuItem onClick={handleChangeRole} className="font-medium">
                           {t("workspace.changeRoleAction")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenDeleteAlert(true)} className="font-medium text-red-700">
                           {t("workspace.deleteMemberAction")}
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>{t("workspace.deleteMemberConfirmTitle")}</AlertDialogTitle>
                           <AlertDialogDescription>
                              {t("workspace.deleteMemberConfirmDescription")}
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                           <AlertDialogAction onClick={handleDeleteMember}>{t("common.yes")}</AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </>
            )}
         </div>
      </>
   );
}; 

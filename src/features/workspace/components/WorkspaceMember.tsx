import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar"; import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/shared/ui/shadcn/dropdown-menu"
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
import { useDeleteMemberMutation } from "@/features/workspace/api/workspaceApi";
import { toast } from "sonner";
import type { IWorkspaceMember } from "../types/workspace-member";
import type { IWorkspacePermission } from "../types/workspace-permission";
import { WORKSPACE_ROLE_LABEL } from "../constants/workspace-role-label";

interface IWorkspaceMemberProps {
   member: IWorkspaceMember
   permissions: IWorkspacePermission,
   workspaceId: string
}

export const WorkspaceMember = ({ member, permissions, workspaceId }: IWorkspaceMemberProps) => {
   const { open, close } = useModal()
   const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
   const [deleteMember] = useDeleteMemberMutation()

   const handleChangeRole = () => {
      open({
         title: 'Изменить роль участника',
         description: '',
         content: <ChangeRoleMember workspaceId={workspaceId} member={member} close={close} />
      })
   }

   const handleDeleteMember = async () => {
      try {
         await deleteMember({ workspaceId, userId: member.user.id }).unwrap();

         toast.success('Участник успешно удален');
      } catch (error) {
         toast.error('Ошибка при удалении участника');
      }

      setOpenDeleteAlert(false);
   }

   return (
      <>
         <div key={member.id} className="flex w-full items-center justify-between border-b px-2 py-2">
            <div className="flex items-center gap-3">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div>
                  <div className="font-medium">{member.user.username}</div>
                  <div className="italic text-sm">{WORKSPACE_ROLE_LABEL[member.role]}</div>
               </div>
            </div>
            {permissions.canChangeRole && (
               <>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Ellipsis className="cursor-pointer" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="-translate-x-[50px]">
                        <DropdownMenuItem onClick={handleChangeRole} className="font-medium">Изменить роль</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenDeleteAlert(true)} className="font-medium text-red-700">Удалить участника</DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Вы действительно хотите удалить участника?</AlertDialogTitle>
                           <AlertDialogDescription>
                              После удаления участника, он больше не сможет получить доступ к этому воркспейсу.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Отмена</AlertDialogCancel>
                           <AlertDialogAction onClick={handleDeleteMember}>Да</AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </>
            )}
         </div>
      </>
   );
}; 

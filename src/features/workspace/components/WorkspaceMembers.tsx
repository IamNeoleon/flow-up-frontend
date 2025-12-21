import type { FC } from "react";
import { useGetWorkspaceMembersQuery } from "@/api/endpoints/workspaceApi";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/shared/ui/table"
import { getWorkspaceRole } from "@/shared/lib/utils/utils";
import { useModal } from "@/app/providers/ModalProvider";
import { AddMember } from "@/features/workspace/components/AddMember";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

export const WorkspaceMembers: FC<{ workspaceId: string }> = ({ workspaceId }) => {
   const { data: members } = useGetWorkspaceMembersQuery(workspaceId)
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
         <Table className="w-[750px]">
            <TableHeader>
               <TableRow>
                  <TableHead>Имя пользователя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Роль</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {members?.map((member) => (
                  <TableRow key={member.id}>
                     <TableCell className="font-medium">{member.user.username}</TableCell>
                     <TableCell>{member.user.email}</TableCell>
                     <TableCell className="text-right">{getWorkspaceRole(member.role)}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <Button onClick={handleAddMember} className='flex items-center fixed bottom-14 right-10' variant='outline'>
            <Plus />
            <span>Добавить участника</span>
         </Button>
      </>
   );
};

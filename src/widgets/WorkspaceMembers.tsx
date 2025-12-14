import type { FC } from "react";
import { useGetWorkspaceMembersQuery } from "@/api/endpoints/workspaceApi";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { getWorkspaceRole } from "@/lib/utils";

export const WorkspaceMembers: FC<{ workspaceId: string }> = ({ workspaceId }) => {
   const { data: members, isLoading, isError } = useGetWorkspaceMembersQuery(workspaceId)

   return (
      <>
         <Table className="w-[750px]">
            <TableCaption>A list of your recent invoices.</TableCaption>
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
      </>
   );
};

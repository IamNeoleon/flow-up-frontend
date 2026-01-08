import type { TBoardRole } from "@/shared/constants/board.permissions";
import { BOARD_MEMBER_STATUS_LABELS } from "@/shared/constants/boardMemberStatus";
import { useAppSelector } from "@/shared/hooks/redux";
import { useWorkspaceRole } from "@/shared/hooks/useWorkspaceRole";
import type { IBoardMember } from "@/shared/types/board.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/shadcn/select";
import { selectPermissions } from "@/store/slices/boardSlice";
import { useState } from "react";

interface IBoardMemberProps {
   member: IBoardMember,
   workspaceId: string
}

export const BoardMember = ({ member, workspaceId }: IBoardMemberProps) => {
   const [role, setRole] = useState<TBoardRole>(member.boardRole)
   const workspaceRole = useWorkspaceRole(workspaceId, member.userId)
   const isOwner = workspaceRole === 'OWNER' || role === 'OWNER'
   const permissions = useAppSelector(selectPermissions)
   console.log(permissions);

   return (
      <>
         <div className="flex items-center justify-between border-y py-3 px-2">
            <div className="flex items-center gap-2">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <span className="font-medium">
                  {member.user.username}
               </span>
            </div>
            <Select disabled={isOwner || !permissions?.canDeleteBoard} value={role} onValueChange={(value) => setRole(value as TBoardRole)}>
               <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Р" />
               </SelectTrigger>
               <SelectContent>
                  {
                     Object.entries(BOARD_MEMBER_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                     ))
                  }
               </SelectContent>
            </Select>
         </div>
      </>
   );
};

import type { TBoardRole } from "../types/board-role";
import { BOARD_MEMBER_STATUS_LABELS } from "../constants/board-member-status";
import { useAppSelector } from "@/shared/hooks/redux";
import { useWorkspaceRole } from "@/shared/hooks/use-workspace-role";
import type { IBoardMember } from "../types/board-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/shadcn/select";
import { selectPermissions } from "@/store/slices/boardSlice";
import { useTranslation } from "react-i18next";
import { useChangeBoardRoleMutation } from "../api/boardApi";
import { toast } from "sonner";
import { selectUser } from "@/store/slices/userSlice";

interface IBoardMemberProps {
   member: IBoardMember,
   workspaceId: string,
   boardId: string
}

export const BoardMember = ({ member, workspaceId, boardId }: IBoardMemberProps) => {
   const { t } = useTranslation()
   const permissions = useAppSelector(selectPermissions)
   const [changeRole] = useChangeBoardRoleMutation()

   const user = useAppSelector(selectUser)

   const isMe = member.userId === user?.id
   const isTargetWorkspaceOwner = useWorkspaceRole(workspaceId, member.userId) === 'OWNER'
   const isTargetBoardOwner = member.boardRole === 'OWNER'

   // console.log(permissions);

   const disabledSelect =
      !permissions?.canChangeRole ||
      isMe ||
      isTargetWorkspaceOwner ||
      isTargetBoardOwner

   const onChangeRole = async (role: TBoardRole) => {
      try {
         await changeRole({
            targetRole: role,
            targetUserId: member.userId,
            workspaceId,
            boardId
         }).unwrap()

         toast.success('Success')
      } catch (error) {
         toast.error('Error')
      }
   }

   return (
      <>
         <div className="first:border-t flex items-center justify-between border-b py-2 px-2">
            <div className="flex items-center gap-2">
               <Avatar>
                  <AvatarImage src={member.user.avatar ?? ''} />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <span className="font-medium">
                  {member.user.fullName}
               </span>
            </div>
            <Select disabled={disabledSelect} value={member.boardRole} onValueChange={(value) => onChangeRole(value as TBoardRole)}>
               <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("workspace.roleLabel")} />
               </SelectTrigger>
               <SelectContent>
                  {
                     Object.entries(BOARD_MEMBER_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{t(label)}</SelectItem>
                     ))
                  }
               </SelectContent>
            </Select>
         </div>
      </>
   );
};

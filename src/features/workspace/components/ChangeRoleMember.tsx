import { useState } from "react";
import type { IWorkspaceMember } from "../types/workspace-member";
import type { TWorkspaceRole } from "../types/workspace-role";
import { Label } from "@/shared/ui/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/shadcn/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { Button } from "@/shared/ui/shadcn/button";
import { useChangeMemberRoleMutation } from "@/features/workspace/api/workspaceApi";
import { toast } from "sonner";

interface IChangeRoleMemberProps {
   member: IWorkspaceMember,
   workspaceId: string,
   close: () => void
}

export const ChangeRoleMember = ({ member, workspaceId, close }: IChangeRoleMemberProps) => {
   const [changeRole] = useChangeMemberRoleMutation()
   const [role, setRole] = useState<TWorkspaceRole>(member.role)

   const handleChange = async () => {
      try {
         await changeRole({
            workspaceId,
            userId: member.userId,
            role
         }).unwrap()

         toast.success('Успешно изменена роль')
      } catch (error) {
         toast.error('Не удалось изменить роль')
      }

      close()
   }

   return (
      <>
         <div>
            <Label className="mb-1 text-sm">Участник</Label>
            <div className="flex items-center gap-3">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div>
                  <div className="font-medium">{member.user.username}</div>
               </div>
            </div>
         </div>
         <div>
            <Label className="mb-1 text-sm">Роль</Label>
            <Select value={role} onValueChange={(value: TWorkspaceRole) => setRole(value)}>
               <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите роль" />
               </SelectTrigger>
               <SelectContent className='text-lg'>
                  <SelectItem value="MEMBER">Наблюдатель</SelectItem>
                  <SelectItem value="EDITOR">Редактор</SelectItem>
               </SelectContent>
            </Select>
         </div>
         <Button onClick={handleChange}>Изменить</Button>
      </>
   );
};

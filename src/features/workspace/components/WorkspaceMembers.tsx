import { useGetWorkspaceMembersQuery } from "@/api/endpoints/workspaceApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { getErrorMessage } from "@/shared/utils";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import clsx from "clsx";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu"
import { Ellipsis } from "lucide-react";
import { useModal } from "@/app/providers/ModalProvider";
import { AddMember } from "./AddMember";

interface IWorkspaceMembersProps {
   workspaceId: string
}

export const WorkspaceMembers = ({ workspaceId }: IWorkspaceMembersProps) => {
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
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Ellipsis className="cursor-pointer" />
               </DropdownMenuTrigger>
               <DropdownMenuContent className="-translate-x-[50px]">
                  <DropdownMenuItem onClick={handleAddMember} className="font-medium">Добавить участника</DropdownMenuItem>
                  <DropdownMenuItem className="font-medium text-red-700 ">Удалить участника</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <div className="bg-[#171717] rounded-lg py-2 px-5">
            <div className={clsx("flex flex-col gap-4 min-h-[250px]", { 'justify-center items-center': true })}>
               {
                  isLoading ? (
                     <Spinner className="size-7" />
                  ) : (
                     !isError ? (
                        <div>
                           {
                              members && members.length > 0 ? members.map(member => (
                                 <div key={member.id} className="flex items-center justify-between border-b py-2">
                                    <div className="flex items-center gap-3">
                                       <Avatar>
                                          <AvatarImage src="https://github.com/shadcn.png" />
                                          <AvatarFallback>CN</AvatarFallback>
                                       </Avatar>
                                       <div className="font-medium">{member.user.username}</div>
                                    </div>
                                    <div className="italic">{member.role}</div>
                                 </div>
                              )) : (
                                 <div className="italic">
                                    Кроме вас, тут никого нет
                                 </div>
                              )
                           }
                        </div>
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

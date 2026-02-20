import { Check, Users } from "lucide-react";
import { ValuePicker } from "@/shared/ui/ValuePicker";
import type { IUser } from "@/services/user/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar"
import { useState } from "react";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/shared/ui/shadcn/command"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/shared/ui/shadcn/popover"
import { cn } from "@/shared/utils/cn";
import { useLazyGetWorkspaceMembersQuery } from "@/services/workspace/api/workspaceApi";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

interface ITaskAssigneeProps {
   taskAssignee?: Pick<IUser, 'id' | 'username' | 'avatar' | 'fullName'> | null;
   handleAssigneeChange: (assignee: Pick<IUser, 'id' | 'username' | 'avatar' | 'fullName'> | null) => void;
}

export const TaskAssignee = ({ taskAssignee, handleAssigneeChange }: ITaskAssigneeProps) => {
   const { t } = useTranslation()
   const { workspaceId } = useParams()

   const [open, setOpen] = useState(false);
   const [assigneeId, setAssigneeId] = useState("");

   const [getWorkspaceMembers, { data: members, isLoading, isError }] = useLazyGetWorkspaceMembersQuery();

   const handleGetMembers = () => {
      if (!workspaceId) return

      getWorkspaceMembers(workspaceId);
   }

   return (
      <>
         <div>
            <div className="flex mb-1 gap-1 items-center text-base text-[#ada9a3] font-medium">
               <Users width={18} />
               <span>{t("task.assignee")}</span>
            </div>
            <Popover open={open} onOpenChange={(nextOpen) => {
               setOpen(nextOpen)
               handleGetMembers()
            }}>
               <PopoverTrigger>
                  <ValuePicker>
                     {
                        taskAssignee && (
                           <>
                              <div className="flex items-center gap-2">
                                 <Avatar className="w-6 h-6">
                                    <AvatarImage src={taskAssignee.avatar || ""} />
                                    <AvatarFallback className="text-[10px]">CN</AvatarFallback>
                                 </Avatar>
                                 <span className="font-medium">
                                    {taskAssignee.fullName}
                                 </span>
                              </div>
                           </>
                        )
                     }
                  </ValuePicker>
               </PopoverTrigger>
               <PopoverContent>
                  <Command>
                     <CommandInput placeholder={t("workspace.membersSearchPlaceholder")} className="h-9" />
                     <CommandList>
                        <CommandEmpty>{t("common.noResults")}</CommandEmpty>
                        <CommandGroup>
                           {
                              isLoading ? (
                                 <Spinner />
                              ) : (
                                 !isError ? (
                                    <>
                                       <CommandItem
                                          onSelect={() => {
                                             handleAssigneeChange(null);
                                             setOpen(false);
                                          }}
                                          className="text-red-500"
                                       >
                                          {t("task.assigneeRemove")}
                                       </CommandItem>
                                       {
                                          members?.map(member => (
                                             <CommandItem
                                                key={member.id}
                                                value={member.user.username}
                                                onSelect={(_) => {
                                                   setAssigneeId(member.userId === assigneeId ? "" : member.userId)
                                                   handleAssigneeChange(member.user)
                                                   setOpen(false)
                                                }}
                                             >
                                                <div className="flex items-center gap-2">
                                                   <Avatar className="w-6 h-6">
                                                      <AvatarImage src={member.user.avatar || ""} />
                                                      <AvatarFallback className="text-[10px]">CN</AvatarFallback>
                                                   </Avatar>
                                                   <span className="font-medium">
                                                      {member.user.fullName}
                                                   </span>
                                                </div>
                                                <Check
                                                   className={cn(
                                                      "ml-auto",
                                                      assigneeId === member.userId ? "opacity-100" : "opacity-0"
                                                   )}
                                                />
                                             </CommandItem>
                                          ))
                                       }
                                    </>
                                 ) : (
                                    <div>{t("task.assigneeLoadError")}</div>
                                 )
                              )
                           }
                        </CommandGroup>
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>
         </div>
      </>
   );
};

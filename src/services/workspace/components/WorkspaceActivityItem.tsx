import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar"
import { getUserInitials } from "@/shared/utils/get-user-initials";

interface IWorkspaceActivityItemProps {
   username: string,
   userAvatar?: string,
   activityLabel: string,
   entityName: string,
   time: string
}

export const WorkspaceActivityItem = ({ username, userAvatar, activityLabel, entityName, time }: IWorkspaceActivityItemProps) => {
   return (
      <>
         <div className="flex justify-between items-center pl-2 py-4 border-b">
            <div className="flex gap-2 items-center">
               <Avatar>
                  <AvatarImage src={userAvatar ?? ''} />
                  <AvatarFallback>{getUserInitials(username)}</AvatarFallback>
               </Avatar>
               <div className="text-base flex gap-1 items-center">
                  <span className="font-semibold">{username}</span>
                  <span>{activityLabel}</span>
                  <span className="font-semibold">{entityName}</span>
               </div>
            </div>
            <div className="text-md text-muted-foreground italic">{time}</div>
         </div>
      </>
   );
};

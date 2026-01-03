import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar"

interface IWorkspaceRecentProps { }

export const WorkspaceRecent = ({ }: IWorkspaceRecentProps) => {
   return (
      <>
         <h2 className="text-xl font-medium capitalize mb-5">Последние действия</h2>
         <div className="flex flex-col py-2 px-5 bg-[#171717] rounded-lg">
            <div className="flex gap-2 items-center pl-2 py-4 border-b">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div className="text-base">
                  <span className="font-semibold">Emma</span> created the board <span className="font-semibold">"Team Meetings"</span>
               </div>
               <div className="text-md text-muted-foreground mt-1 italic">10 minutes ago</div>
            </div>
            <div className="flex gap-2 items-center pl-2 py-4 border-b">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div className="text-base">
                  <span className="font-semibold">Emma</span> created the board <span className="font-semibold">"Team Meetings"</span>
               </div>
               <div className="text-md text-muted-foreground mt-1 italic">10 minutes ago</div>
            </div>
            <div className="flex gap-2 items-center pl-2 py-4 border-b">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div className="text-base">
                  <span className="font-semibold">Emma</span> created the board <span className="font-semibold">"Team Meetings"</span>
               </div>
               <div className="text-md text-muted-foreground mt-1 italic">10 minutes ago</div>
            </div>
            <div className="flex gap-2 items-center pl-2 py-4 border-b">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div className="text-base">
                  <span className="font-semibold">Emma</span> created the board <span className="font-semibold">"Team Meetings"</span>
               </div>
               <div className="text-md text-muted-foreground mt-1 italic">10 minutes ago</div>
            </div>
         </div>
      </>
   );
};

import { FolderKanban, SquareCheck, Gavel, CheckCheck } from "lucide-react";
import { Progress } from "@/shared/ui/shadcn/progress";

interface IWorkspaceStatsProps { }

export const WorkspaceStats = ({ }: IWorkspaceStatsProps) => {
   return (
      <>
         <div className="grid grid-cols-4 gap-5 pb-10 mb-5 border-b">
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <FolderKanban />
                  <div className="text-xl">
                     Активных досок: 5
                  </div>
               </div>
               <Progress value={77} />
            </div>
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <SquareCheck />
                  <div className="text-xl">
                     Всего задач: 128
                  </div>
               </div>
               <Progress value={100} />
            </div>
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <Gavel />
                  <div className="text-xl">
                     Задач в работе: 5
                  </div>
               </div>
               <Progress value={5} />
            </div>
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <CheckCheck />
                  <div className="text-xl">
                     Завершенных задач: 52
                  </div>
               </div>
               <Progress value={52} />
            </div>
         </div>
      </>
   );
};

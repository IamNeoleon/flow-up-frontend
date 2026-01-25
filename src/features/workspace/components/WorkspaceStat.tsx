import { SquareCheck, Gavel, CheckCheck } from "lucide-react";
import { Progress } from "@/shared/ui/shadcn/progress";
import { useGetStatisticQuery } from "../api/workspaceApi";

interface IWorkspaceStatsProps {
   workspaceId: string
}

export const WorkspaceStats = ({ workspaceId }: IWorkspaceStatsProps) => {
   const { data = { total: 0, inProgress: 0, done: 0 } } = useGetStatisticQuery(workspaceId)

   const inProgressPercent = data.total ? Math.round((data.inProgress * 100) / data.total) : 0;
   const donePercent = data.total ? Math.round((data.done * 100) / data.total) : 0;

   return (
      <>
         <div className="grid grid-cols-3 gap-5 pb-10 mb-5 border-b">
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <SquareCheck />
                  <div className="text-xl">
                     Всего задач: {data?.total}
                  </div>
               </div>
               <Progress value={100} />
            </div>
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <Gavel />
                  <div className="text-xl">
                     Задач в работе: {data?.inProgress}
                  </div>
               </div>
               <Progress value={inProgressPercent} />
            </div>
            <div className="p-5 border rounded-lg">
               <div className="flex items-center gap-3 mb-5">
                  <CheckCheck />
                  <div className="text-xl">
                     Завершенных задач: {data?.done}
                  </div>
               </div>
               <Progress value={donePercent} />
            </div>
         </div>
      </>
   );
};

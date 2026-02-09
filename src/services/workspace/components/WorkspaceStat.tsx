import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { SquareCheck, Gavel, CheckCheck } from "lucide-react";
import { useGetStatisticsQuery } from "../api/workspaceApi";
import { routes } from "@/shared/routes";
import { Progress } from "@/shared/ui/shadcn/progress";

interface IWorkspaceStatsProps {
   workspaceId: string
}

export const WorkspaceStats = ({ workspaceId }: IWorkspaceStatsProps) => {
   const { t } = useTranslation()
   const { data = { total: 0, inProgress: 0, done: 0 } } = useGetStatisticsQuery(workspaceId)

   const inProgressPercent = data.total ? Math.round((data.inProgress * 100) / data.total) : 0;
   const donePercent = data.total ? Math.round((data.done * 100) / data.total) : 0;

   return (
      <>
         <div className="mb-3 flex justify-between items-center">
            <h2 className="text-xl font-medium">{t('statistics.title')}</h2>
            <Link to={routes.workspaceStatistics({ workspaceId })} className="text-right text-primary font-medium cursor-pointer transition-colors hover:text-primary/65">
               {t('statistics.viewAll')}
            </Link>
         </div>
         <div className="pb-10 mb-5 border-b">
            <div className="grid grid-cols-3 gap-x-5">
               <div className="p-5 border rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                     <SquareCheck />
                     <div className="text-xl">
                        {t("workspace.stats.totalTasks", { count: data?.total })}
                     </div>
                  </div>
                  <Progress value={data?.total ? 100 : 0} />
               </div>
               <div className="p-5 border rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                     <Gavel />
                     <div className="text-xl">
                        {t("workspace.stats.inProgressTasks", { count: data?.inProgress })}
                     </div>
                  </div>
                  <Progress value={inProgressPercent} />
               </div>
               <div className="p-5 border rounded-lg">
                  <div className="flex items-center gap-3 mb-5">
                     <CheckCheck />
                     <div className="text-xl">
                        {t("workspace.stats.doneTasks", { count: data?.done })}
                     </div>
                  </div>
                  <Progress value={donePercent} />
               </div>
            </div>
         </div>
      </>
   );
};

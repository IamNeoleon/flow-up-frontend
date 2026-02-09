import { useParams } from "react-router";
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { StatisticBlocks } from "@/services/statistic/ui/StatisticsBlocks";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { useTranslation } from "react-i18next";
import { useCurrentWorkspace } from "@/shared/hooks/use-current-workspace";

const WorkspaceStaticPage = () => {
   const { t } = useTranslation()

   const { workspaceId } = useParams()

   const { currentWorkspace } = useCurrentWorkspace(workspaceId)

   return (
      <>
         <div className="pt-5">
            <Card className="w-full">
               <CardContent className="w-full flex justify-between items-center">
                  <div>
                     <h2 className="text-xl font-medium leading-tight mb-1 ">
                        {t('statistics.titlePage')}
                     </h2>
                     <h1 className="text-primary font-medium text-2xl capitalize">{currentWorkspace?.name}</h1>
                  </div>
                  <div className="flex gap-6 opacity-40">
                     <BarChart3 size={48} />
                     <LineChart size={48} />
                     <PieChart size={48} />
                  </div>
               </CardContent>
            </Card>
            <StatisticBlocks workspaceId={workspaceId} />
         </div>
      </>
   );
};

export default WorkspaceStaticPage

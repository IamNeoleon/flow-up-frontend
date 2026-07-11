import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { StatisticBlocks } from '@/services/statistic/components/StatisticsBlocks';
// import { useCurrentWorkspace } from '@/shared/hooks/use-current-workspace';
import { Card, CardContent } from '@/shared/ui/shadcn/card';

const WorkspaceStaticPage = () => {
    const { t } = useTranslation();

    const { workspaceId } = useParams();

    // const { currentWorkspace } = useCurrentWorkspace(workspaceId);

    return (
        <div className="pt-5">
            <Card className="w-full">
                <CardContent className="flex w-full items-center justify-between">
                    <div>
                        <h2 className="mb-1 text-xl leading-tight font-medium">
                            {t('statistics.titlePage')}
                        </h2>
                        <h1 className="text-primary text-2xl font-medium capitalize">
                            {/* {currentWorkspace?.name} */}
                        </h1>
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
    );
};

export default WorkspaceStaticPage;

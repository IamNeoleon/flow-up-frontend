import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useWorkspacePermissions } from '@/services/workspace/hooks/use-workspace-permissions';
import { formatActivityTime } from '@/shared/lib/formate-activity-time';
import { routes } from '@/shared/routes';
import { Card, CardContent, CardTitle } from '@/shared/ui/shadcn/card';
import { cn } from '@/shared/utils/cn';
import { BoardCardImage } from './BoardCardImage';
import { BoardCardUploadImage } from './BoardCardUploadImage';

interface IProps {
    id: string;
    title: string;
    image?: string;
    updatedAt: string;
    workspaceId: string;
}

export const BoardCard = ({
    id,
    title,
    image,
    updatedAt,
    workspaceId,
}: IProps) => {
    const { t } = useTranslation();
    const { permissions } = useWorkspacePermissions({  });

    return (
        <Card
            className={cn(
                'relative w-[250px] overflow-hidden p-0',
                'bg-card text-card-foreground border-border/60 border',
                'group shadow-sm transition-all duration-150 ease-out',
                'hover:border-primary/20 hover:-translate-y-1 hover:shadow-md',
                'focus-within:ring-ring/40 focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
                'dark:hover:border-primary/25 dark:shadow-none',
            )}
        >
            <CardContent className="relative p-0">
                <BoardCardImage title={title} image={image} />
                <div className="p-3">
                    <CardTitle className="truncate text-base leading-tight font-semibold">
                        {title}
                    </CardTitle>

                    <div className="text-muted-foreground mt-1 flex flex-col text-sm">
                        <span>{t('common.updated')}:</span>
                        <span className="italic">
                            {formatActivityTime(updatedAt)}
                        </span>
                    </div>
                </div>
                <Link
                    to={routes.board({ workspaceId, boardId: id })}
                    className="absolute inset-0 z-0"
                />
                <BoardCardUploadImage
                    workspaceId={workspaceId}
                    boardId={id}
                    canEditImage={permissions.canEditWorkspace}
                />
            </CardContent>
        </Card>
    );
};

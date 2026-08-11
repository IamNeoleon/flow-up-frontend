import { useGetTaskListQuery } from '@/services/board/api/hooks';
import { TaskTableList } from './task-table-list';
import { getColumns } from '@/widgets/task-table/ui/table-columns';
import { useTranslation } from 'react-i18next';
import { TableSkeleton } from './table-skeleton';

interface Props {
    workspaceId: string;
    boardId: string;
}

export const TaskTableBlock = ({ workspaceId, boardId }: Props) => {
    const { t } = useTranslation();

    const { data: tasks, isLoading } = useGetTaskListQuery({
        workspaceId,
        boardId,
    });

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="relative">
            <TaskTableList
                workspaceId={workspaceId}
                boardId={boardId}
                columns={getColumns(t)}
                tasks={tasks ?? []}
            />
        </div>
    );
};

import { useTranslation } from 'react-i18next';
import { TaskPriority } from '@/services/task/components/TaskPriority';
import { useUpdateTaskDetails } from '@/services/task/api/hooks/use-update-task-details';
import type { CellProps } from '../../types/cell-props';

export const PriorityCell = ({ task }: CellProps) => {
    const { t } = useTranslation();
    const { handleUpdateDetails } = useUpdateTaskDetails();

    if (!task) {
        return (
            <span className="text-muted-foreground">{t('common.notSet')}</span>
        );
    }

    return (
        <TaskPriority
            taskPriorityId={task.priorityId}
            onChange={(p) => {
                handleUpdateDetails({ priorityId: p.id }, task.colId, task.id);
            }}
            hasLabel={false}
        />
    );
};

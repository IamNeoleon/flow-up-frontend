import { TaskDueDate } from '@/services/task/components/TaskDueDate';
import { useUpdateTaskDetails } from '@/services/task/api/hooks/use-update-task-details';
import type { CellProps } from '../../types/cell-props';

export const CalendarCell = ({ task }: CellProps) => {
    const { handleUpdateDetails } = useUpdateTaskDetails();

    return (
        <TaskDueDate
            dueDate={task.dueDate}
            setDueDate={(d) => {
                handleUpdateDetails(
                    { dueDate: d?.toISOString() },
                    task.colId,
                    task.id,
                );
            }}
            showLabel={false}
        />
    );
};

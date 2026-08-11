import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { Badge } from '@/shared/ui/shadcn/badge';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/shadcn/select';
import { useMoveTaskMutation } from '@/services/task/api/hooks';
import type { TableTask } from '@/services/task/types/table-task';
import { useGetFilteredColumns } from '../../hooks/use-get-filtered-columns';

interface Props {
    task: TableTask;
}

export const StatusCell = ({ task }: Props) => {
    const { t } = useTranslation();
    const { boardId } = useParams();

    const { columns, todoCols, inProgressCols, doneCols } =
        useGetFilteredColumns(boardId);
    const [moveTask] = useMoveTaskMutation();

    const [selectedColId, setSelectedColId] = useState(task.colId);

    useEffect(() => {
        setSelectedColId(task.colId);
    }, [task.colId]);

    const selectedColumn = columns?.find(
        (column) => column.id === selectedColId,
    );

    const handleChange = async (newColId: string) => {
        const previousColId = selectedColId;

        setSelectedColId(newColId);

        try {
            if (boardId) {
                moveTask({
                    taskId: task.id,
                    boardId,
                    colId: task.colId,
                    body: {
                        targetColId: newColId,
                    },
                });
            }
        } catch {
            setSelectedColId(previousColId);
        }
    };

    return (
        <Select value={selectedColId} onValueChange={handleChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue>
                    <Badge
                        style={{ backgroundColor: selectedColumn?.color }}
                        className="relative flex items-center gap-1"
                    >
                        <span className="text-white">
                            {selectedColumn?.name}
                        </span>
                    </Badge>
                </SelectValue>
            </SelectTrigger>

            <SelectContent>
                {todoCols.length > 0 && (
                    <SelectGroup>
                        <SelectLabel>{t('column.todo')}</SelectLabel>

                        {todoCols.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                                <Badge
                                    style={{
                                        backgroundColor: col.color,
                                    }}
                                    className="flex items-center gap-1"
                                >
                                    <span className="text-white">
                                        {col.name}
                                    </span>
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                )}

                {inProgressCols.length > 0 && (
                    <SelectGroup>
                        <SelectLabel>{t('column.inProgress')}</SelectLabel>

                        {inProgressCols.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                                <Badge
                                    style={{
                                        backgroundColor: col.color,
                                    }}
                                    className="flex items-center gap-1"
                                >
                                    <span className="text-white">
                                        {col.name}
                                    </span>
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                )}

                {doneCols.length > 0 && (
                    <SelectGroup>
                        <SelectLabel>{t('column.done')}</SelectLabel>

                        {doneCols.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                                <Badge
                                    style={{
                                        backgroundColor: col.color,
                                    }}
                                    className="flex items-center gap-1"
                                >
                                    <span className="text-white">
                                        {col.name}
                                    </span>
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                )}
            </SelectContent>
        </Select>
    );
};

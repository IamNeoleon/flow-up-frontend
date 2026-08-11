import { ArrowUpDown } from 'lucide-react';
import { CalendarCell } from './cells/calendar-cell';
import { PriorityCell } from './cells/priority-cell';
import { NameCell } from './cells/name-cell';
import { StatusCell } from './cells/status-cell';
import type { TFunction } from 'i18next';
import type { ColumnDef } from '@tanstack/react-table';
import type { TableTask } from '@/services/task/types/table-task';

export const getColumns = (t: TFunction): ColumnDef<TableTask>[] => {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <div
                    className="flex cursor-pointer items-center gap-0.5"
                    onClick={() => column.toggleSorting()}
                >
                    <ArrowUpDown className="h-4 w-4" />
                    <span>{t('task.title')}</span>
                </div>
            ),
            cell: ({ row }) => <NameCell task={row.original} />,
        },
        {
            accessorKey: 'column.name',
            header: t('task.status'),
            cell: ({ row }) => <StatusCell task={row.original} />,
        },
        {
            accessorKey: 'dueDate',
            header: t('task.dueDate'),
            cell: ({ row }) => <CalendarCell task={row.original} />,
        },
        {
            accessorKey: 'priority.name',
            header: t('task.priority'),
            cell: ({ row }) => <PriorityCell task={row.original} />,
        },
    ];
};

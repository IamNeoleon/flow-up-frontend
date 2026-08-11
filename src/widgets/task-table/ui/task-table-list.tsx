import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { useCallback, useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/shadcn/table';
import { Input } from '@/shared/ui/shadcn/input';
import type { TableTask } from '@/services/task/types/table-task';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { useWorkspacePermissions } from '@/services/workspace/hooks/use-workspace-permissions';
import { useModal } from '@/app/providers/ModalProvider';
import { CreateTask } from '@/services/task/components/CreateTask';
import { Button } from '@/shared/ui/shadcn/button';

interface Props {
    columns: ColumnDef<TableTask>[];
    tasks: TableTask[];
    workspaceId: string;
    boardId: string;
}

export const TaskTableList = ({ columns, tasks, boardId }: Props) => {
    const { t } = useTranslation();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'name',
            desc: false,
        },
    ]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data: tasks,
        columns,

        state: {
            sorting,
            globalFilter,
        },

        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const { permissions } = useWorkspacePermissions({});
    const { open, close } = useModal();

    const handleCreateTask = useCallback(() => {
        if (!boardId) return;
        open({
            title: t('task.create'),
            description: t('task.createDescription'),
            content: (
                <CreateTask
                    close={close}
                    boardId={boardId}
                    withColumnChoice={true}
                />
            ),
        });
    }, [boardId, open, close, t]);

    return (
        <div>
            <div className="mb-2 flex items-center gap-5">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        value={(table.getState().globalFilter as string) ?? ''}
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                        placeholder={t('taskList.search')}
                        className="pl-9"
                    />
                </div>
                {permissions?.canCreateTask && (
                    <Button
                        onClick={handleCreateTask}
                        className="flex flex-0 items-center gap-1"
                    >
                        <Plus />
                        {t('task.create')}
                    </Button>
                )}
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

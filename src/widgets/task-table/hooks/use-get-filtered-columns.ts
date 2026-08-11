import { useGetAllColumnsQuery } from '@/services/column/api/hooks';
import { skipToken } from '@reduxjs/toolkit/query';

export const useGetFilteredColumns = (boardId: string | undefined) => {
    const { data: columns } = useGetAllColumnsQuery(boardId ?? skipToken);

    const todoCols = columns?.filter((col) => col.status === 'TODO') ?? [];
    const inProgressCols =
        columns?.filter((col) => col.status === 'IN_PROGRESS') ?? [];
    const doneCols = columns?.filter((col) => col.status === 'DONE') ?? [];

    return {
        columns,
        todoCols,
        inProgressCols,
        doneCols,
    };
};

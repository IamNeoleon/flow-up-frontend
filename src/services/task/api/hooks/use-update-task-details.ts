import { useAppSelector } from '@/shared/hooks/redux';
import { selectCurrentBoardId } from '@/store/slices/board-slice';
import { useUpdateTaskMutation } from '.';
import type { IUpdateTaskDto } from '../../types';
import type { IUser } from '@/services/user/types/user';

export const useUpdateTaskDetails = () => {
    const boardId = useAppSelector(selectCurrentBoardId);
    const [updateTask] = useUpdateTaskMutation();

    const handleUpdateDetails = (
        fields: Partial<IUpdateTaskDto>,
        colId: string,
        taskId: string,
        assignee?: Pick<
            IUser,
            'id' | 'username' | 'avatar' | 'fullName'
        > | null,
    ) => {
        updateTask({
            boardId,
            colId,
            taskId,
            body: fields,
            assignee: assignee,
        });
    };

    return { handleUpdateDetails };
};

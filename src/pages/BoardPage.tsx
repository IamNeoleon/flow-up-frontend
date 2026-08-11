import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { ServerCrash, ListTodo, Kanban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetBoardQuery } from '@/services/board/api/hooks/';
import { BoardHeader } from '@/services/board/components/BoardHeader';
import { useWsBoard } from '@/services/board/hooks/use-ws-board';
import { TaskSheet } from '@/services/task/components/TaskSheet';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { useCurrentWorkspace } from '@/shared/hooks/use-current-workspace';
import { useTitle } from '@/shared/hooks/use-title';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { setCurrentBoardId } from '@/store/slices/board-slice';
import { selectUser } from '@/store/slices/user-slice';
import { KanbanBoard } from '@/widgets/KanbanBoard/ui/KanbanBoard';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shared/ui/shadcn/tabs';
import { TaskTableBlock } from '@/widgets/task-table/ui/task-table-block';

const BoardPage = () => {
    const { boardId, workspaceId } = useParams();

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { currentWorkspace } = useCurrentWorkspace();

    const {
        data: board,
        isLoading,
        isError,
    } = useGetBoardQuery(
        boardId && workspaceId ? { boardId, workspaceId } : skipToken,
    );

    useWsBoard(user?.id, boardId);
    useTitle(currentWorkspace?.name ?? '');

    useEffect(() => {
        if (boardId) {
            dispatch(setCurrentBoardId(boardId));
        }
    }, [boardId, dispatch]);

    if (isLoading)
        return (
            <Spinner className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2" />
        );

    if (isError || !board)
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-2xl">
                    <ServerCrash className="text-destructive h-7 w-7" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">
                        {t('errors.boardLoad')}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t('common.tryAgainLater')}
                    </p>
                </div>
            </div>
        );

    return (
        <>
            <BoardHeader
                workspaceId={board.workspaceId}
                boardId={board.id}
                boardTitle={board.name}
            />
            <Tabs defaultValue="list" className="w-full">
                <TabsList>
                    <TabsTrigger
                        value="list"
                        className="flex items-center gap-1"
                    >
                        <ListTodo />
                        <span>{t('common.list')}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="kanban"
                        className="flex items-center gap-1"
                    >
                        <Kanban />
                        <span>{t('common.kanban')}</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <TaskTableBlock
                        workspaceId={board.workspaceId}
                        boardId={board.id}
                    />
                </TabsContent>
                <TabsContent value="kanban">
                    <KanbanBoard boardId={board.id} />
                </TabsContent>
            </Tabs>
            <TaskSheet />
        </>
    );
};

export default BoardPage;

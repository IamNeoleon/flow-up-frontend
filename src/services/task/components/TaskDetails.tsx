import { useEffect, useState } from 'react';
import { Trash2 as DeleteIcon } from 'lucide-react';
import ContentEditable from 'react-contenteditable';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { taskApi } from '@/services/task/api/taskApi';
import { useCreateTrackTaskMutation } from '@/services/user-activity/api/hooks/';
import { useWorkspacePermissions } from '@/services/workspace/hooks/use-workspace-permissions';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';
import { SheetHeader, SheetTitle } from '@/shared/ui/shadcn/sheet';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { cn } from '@/shared/utils/cn';
import { getErrorMessage } from '@/shared/utils/get-error-message';
import { selectCurrentBoardId } from '@/store/slices/board-slice';
import {
    useCreateSubtaskMutation,
    useDeleteTaskMutation,
    useGetTaskByIdQuery,
} from '../api/hooks';
import { InlineSubtaskTextarea } from './InlineSubtaskTextarea';
import { TaskAssignee } from './TaskAssignee';
import { TaskAttachments } from './TaskAttachments';
import { TaskCommentsAdd } from './TaskCommentsAdd';
import { TaskCommentsList } from './TaskCommentsList';
import { TaskDueDate } from './TaskDueDate';
import { TaskPriority } from './TaskPriority';
import { TaskSubtask } from './TaskSubtask';

import { useUpdateTaskDetails } from '../api/hooks/use-update-task-details';

interface IProps {
    taskId: string;
    colId: string;
    close: () => void;
}

export const TaskDetails = ({ taskId, colId, close }: IProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { permissions } = useWorkspacePermissions({});
    const boardId = useAppSelector(selectCurrentBoardId);

    const {
        data: task,
        isLoading,
        isError,
        error,
    } = useGetTaskByIdQuery({ boardId, colId, taskId });
    const [createTrack] = useCreateTrackTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [createSubtask] = useCreateSubtaskMutation();
    const { handleUpdateDetails } = useUpdateTaskDetails();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState<string | undefined>('');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        if (!task) {
            return;
        }

        setTitle(task.name);
        setDescription(task.description);
    }, [task]);

    useEffect(() => {
        if (taskId) {
            createTrack({ body: { taskId } });
        }

        return () => {
            close();
        };
    }, [close, createTrack, taskId]);

    if (isLoading) {
        return (
            <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-center">
                <Spinner className="size-9" />
            </div>
        );
    }

    if (isError) {
        return <div className="p-6">{getErrorMessage(error)}</div>;
    }

    if (!task) {
        return <div className="p-6">{t('task.loadError')}</div>;
    }

    const handleCreateSubtask = async (title: string) => {
        const toastId = toast.loading(t('task.subtaskCreateLoading'));

        try {
            const createdSubtask = await createSubtask({
                boardId,
                colId: task.colId,
                taskId: task.id,
                body: { title },
            }).unwrap();

            dispatch(
                taskApi.util.updateQueryData(
                    'getTaskById',
                    { boardId, colId, taskId },
                    (draft) => {
                        draft.todos.push(createdSubtask);
                    },
                ),
            );

            toast.success(t('task.subtaskCreateSuccess'), { id: toastId });
        } catch (error) {
            toast.error(t('task.subtaskCreateError'), { id: toastId });
        }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask({
                boardId,
                colId: task.colId,
                taskId: task.id,
            }).unwrap();
            toast.success(t('task.deleteSuccess'));

            close();
        } catch (error) {
            toast.error(t('task.deleteError'));
        }
    };

    return (
        <div className="relative py-2">
            <SheetHeader>
                <SheetTitle className="mb-3 text-4xl max-md:text-3xl max-sm:text-2xl">
                    <ContentEditable
                        html={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={(e: React.FocusEvent<HTMLElement>) => {
                            const value =
                                e.currentTarget.textContent?.trim() || '';
                            if (value !== task.name) {
                                handleUpdateDetails(
                                    {
                                        name: value,
                                    },
                                    colId,
                                    taskId,
                                );
                            }
                        }}
                        className="line-clamp-4 border-b border-transparent font-bold outline-none focus:border-blue-500"
                    />
                </SheetTitle>
                <div className="flex flex-wrap gap-5">
                    <TaskAssignee
                        taskAssignee={task.assignee}
                        handleAssigneeChange={(assignee) => {
                            handleUpdateDetails(
                                { assigneeId: assignee?.id },
                                colId,
                                taskId,
                                assignee,
                            );
                        }}
                    />
                    <TaskPriority
                        taskPriorityId={task.priorityId}
                        onChange={(p) => {
                            handleUpdateDetails(
                                { priorityId: p.id },
                                colId,
                                taskId,
                            );
                        }}
                    />
                    <TaskDueDate
                        showLabel
                        dueDate={task.dueDate}
                        setDueDate={(d) => {
                            handleUpdateDetails(
                                { dueDate: d?.toISOString() },
                                colId,
                                taskId,
                            );
                        }}
                    />
                </div>
                <div className="mt-5">
                    <h2 className="mb-2 text-xl font-medium max-sm:text-lg">
                        {t('comments.title')}
                    </h2>
                    <div>
                        <TaskCommentsList
                            boardId={boardId}
                            colId={colId}
                            taskId={taskId}
                        />
                        <TaskCommentsAdd
                            boardId={boardId}
                            colId={colId}
                            taskId={taskId}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    <h2 className="mb-2 text-xl font-medium max-sm:text-lg">
                        {t('task.description')}
                    </h2>
                    <ContentEditable
                        html={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={(e: React.FocusEvent<HTMLElement>) => {
                            const next = (
                                e.currentTarget.textContent ?? ''
                            ).trim();
                            const prev = (task.description ?? '').trim();

                            if (next !== prev) {
                                handleUpdateDetails(
                                    { description: next },
                                    colId,
                                    taskId,
                                );
                            }
                        }}
                        className={cn(
                            'border-b border-transparent pb-1 text-lg outline-none',
                            'focus:border-blue-500',
                            !description && 'text-muted-foreground italic',
                        )}
                    />
                </div>
                <div className="mt-5">
                    <h2 className="mb-2 text-xl font-medium max-sm:text-lg">
                        {t('task.subtasksTitle')}
                    </h2>
                    <div className="space-y-1">
                        {task.todos?.map((todo) => (
                            <TaskSubtask
                                key={todo.id}
                                colId={task.colId}
                                taskId={task.id}
                                subtask={todo}
                            />
                        ))}
                        <InlineSubtaskTextarea onCreate={handleCreateSubtask} />
                    </div>
                </div>
                <div className="mt-5">
                    <h2 className="mb-2 text-xl font-medium max-sm:text-lg">
                        {t('task.attachmentsTitle')}
                    </h2>
                    <div className="">
                        <TaskAttachments
                            attachments={task.attachments}
                            boardId={boardId}
                            colId={colId}
                            taskId={taskId}
                        />
                    </div>
                </div>
            </SheetHeader>
            {permissions?.canDeleteTask && (
                <div
                    onClick={() => setOpenAlert(true)}
                    className="max-xs:w-12 max-xs:h-12 absolute right-0 bottom-1 z-10 h-14 w-14 cursor-pointer rounded-full bg-red-700 transition-colors hover:bg-red-400"
                >
                    <DeleteIcon
                        color="#fff"
                        className="max-xs:size-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform"
                    />
                </div>
            )}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('task.deleteConfirmTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('task.deleteConfirmDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.no')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTask}>
                            {t('common.yes')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

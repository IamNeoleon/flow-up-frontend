import { useCallback, useMemo } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';
import { useModal } from '@/app/providers/ModalProvider';
import { useWorkspacePermissions } from '@/services/workspace/hooks/use-workspace-permissions';
import { CreateTask } from './CreateTask';
import { TaskCard } from './TaskCard';

import type { ITaskPreview } from '../types/task-preview';

interface IProps {
    tasks: ITaskPreview[];
    colId: string;
    color?: string;
}

export const TaskList = ({ tasks, colId, color }: IProps) => {
    const [, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const { open, close } = useModal();
    const { boardId } = useParams();
    const { permissions } = useWorkspacePermissions({});

    const openTask = useCallback(
        (colId: string, taskId: string) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set('colId', colId);
                next.set('taskId', taskId);
                return next;
            });
        },
        [setSearchParams],
    );

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => a.order - b.order);
    }, [tasks]);

    const handleCreateTask = useCallback(() => {
        if (!boardId) return;
        open({
            title: t('task.create'),
            description: t('task.createDescription'),
            content: (
                <CreateTask
                    close={close}
                    boardId={boardId}
                    colId={colId}
                    withColumnChoice={true}
                />
            ),
        });
    }, [boardId, colId, open, close, t]);

    if (!boardId) return null;

    return (
        <div className="flex h-full flex-col">
            <Droppable droppableId={colId} type="TASK">
                {(provided) => (
                    <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent"
                    >
                        {sortedTasks.map((task, index) => (
                            <Draggable
                                key={task.id}
                                draggableId={String(task.id)}
                                index={index}
                            >
                                {(taskProvided, dragSnapshot) => (
                                    <li
                                        ref={taskProvided.innerRef}
                                        {...taskProvided.draggableProps}
                                        className={
                                            dragSnapshot.isDragging
                                                ? 'z-50'
                                                : undefined
                                        }
                                    >
                                        <TaskCard
                                            task={task}
                                            color={color}
                                            openTask={openTask}
                                            dragHandleProps={
                                                permissions?.canMoveTask
                                                    ? taskProvided.dragHandleProps
                                                    : null
                                            }
                                        />
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>

            {permissions?.canCreateTask && (
                <div className="shrink-0 pt-2">
                    <button
                        onClick={handleCreateTask}
                        className="relative w-full rounded-lg p-3 text-left transition-colors"
                    >
                        <div
                            style={{ backgroundColor: color }}
                            className="absolute inset-0 rounded-lg brightness-[0.4] transition-colors hover:brightness-[0.5] dark:brightness-[0.3] hover:dark:brightness-[0.4]"
                        />
                        <span
                            style={{ color }}
                            className="pointer-events-none relative z-10 font-medium"
                        >
                            {t('task.newTask')}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

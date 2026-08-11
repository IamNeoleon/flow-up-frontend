import { baseApi } from '@/shared/api/baseApi';
import { taskRoutes } from './routes';

import type {
    AddCommentArgs,
    AddCommentResponse,
} from './contracts/add-comment';
import type {
    CompleteTaskAttachmentArgs,
    CompleteTaskAttachmentResponse,
} from './contracts/complete-upload-attch';
import type {
    CreateSubtaskArgs,
    CreateSubtaskResponse,
} from './contracts/create-subtask';
import type {
    CreateTaskArgs,
    CreateTaskResponse,
} from './contracts/create-task';
import type {
    DeleteTaskAttachmentArgs,
    DeleteTaskAttachmentResponse,
} from './contracts/delete-attch';
import type {
    DeleteCommentArgs,
    DeleteCommentResponse,
} from './contracts/delete-comment';
import type {
    DeleteSubtaskArgs,
    DeleteSubtaskResponse,
} from './contracts/delete-subtask';
import type {
    DeleteTaskArgs,
    DeleteTaskResponse,
} from './contracts/delete-task';
import type {
    EditCommentArgs,
    EditCommentResponse,
} from './contracts/edit-comment';
import type {
    GetTaskByIdArgs,
    GetTaskByIdResponse,
} from './contracts/get-by-id';
import type {
    GetCommentsArgs,
    GetCommentsResponse,
} from './contracts/get-comments';
import type { MoveTaskArgs, MoveTaskResponse } from './contracts/move-task';
import type {
    GetDownloadPresignedUrlArgs,
    GetDownloadPresignedUrlResponse,
} from './contracts/presign-download-attch';
import type {
    GetTaskAttachmentPresignedUrlArgs,
    GetTaskAttachmentPresignedUrlResponse,
} from './contracts/presign-upload-attch';
import type {
    UpdateSubtaskArgs,
    UpdateSubtaskResponse,
} from './contracts/update-subtask';
import type {
    UpdateTaskArgs,
    UpdateTaskResponse,
} from './contracts/update-task';

export const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTaskById: builder.query<GetTaskByIdResponse, GetTaskByIdArgs>({
            query: ({ boardId, colId, taskId }) => ({
                url: taskRoutes.byId(boardId, colId, taskId),
                method: 'GET',
            }),
            providesTags: (_, __, { taskId }) => [{ type: 'Task', id: taskId }],
        }),

        createTask: builder.mutation<CreateTaskResponse, CreateTaskArgs>({
            query: ({ boardId, colId, body }) => ({
                url: taskRoutes.root(boardId, colId),
                method: 'POST',
                body,
            }),
            invalidatesTags: (_, __, { colId, boardId }) => [
                { type: 'Columns', id: colId },
                { type: 'TaskList', id: boardId },
            ],
        }),

        updateTask: builder.mutation<UpdateTaskResponse, UpdateTaskArgs>({
            query: ({ boardId, colId, taskId, body, assignee }) => ({
                url: taskRoutes.byId(boardId, colId, taskId),
                method: 'PATCH',
                body: {
                    name: body.name,
                    priorityId: body.priorityId,
                    dueDate: body.dueDate,
                    description: body.description,
                    assigneeId: assignee?.id ?? null,
                },
            }),
            async onQueryStarted(
                { boardId, colId, taskId, body, assignee },
                { dispatch, queryFulfilled },
            ) {
                const patch = dispatch(
                    taskApi.util.updateQueryData(
                        'getTaskById',
                        { boardId, colId, taskId },
                        (draft) => {
                            if (!draft) return;

                            if (body.name !== undefined) draft.name = body.name;
                            if (body.priorityId !== undefined)
                                draft.priorityId = body.priorityId;
                            if (body.dueDate !== undefined)
                                draft.dueDate = body.dueDate;
                            if (body.description !== undefined)
                                draft.description = body.description;

                            if (assignee !== undefined) {
                                draft.assignee = assignee;
                                draft.assigneeId = assignee?.id ?? undefined;
                            }
                        },
                    ),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
            invalidatesTags: (_, __, { colId, taskId, boardId }) => [
                { type: 'Columns', id: colId },
                { type: 'Task', id: taskId },
                { type: 'TaskList', id: boardId },
            ],
        }),

        deleteTask: builder.mutation<DeleteTaskResponse, DeleteTaskArgs>({
            query: ({ boardId, colId, taskId }) => ({
                url: taskRoutes.byId(boardId, colId, taskId),
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, { colId, boardId }) => [
                { type: 'Columns', id: colId },
                { type: 'TaskList', id: boardId },
            ],
        }),

        moveTask: builder.mutation<MoveTaskResponse, MoveTaskArgs>({
            query: ({ boardId, colId, taskId, body }) => ({
                url: taskRoutes.move(boardId, colId, taskId),
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_, __, { boardId }) => [
                { type: 'TaskList', id: boardId },
            ],
        }),

        createSubtask: builder.mutation<
            CreateSubtaskResponse,
            CreateSubtaskArgs
        >({
            query: ({ boardId, colId, taskId, body }) => ({
                url: taskRoutes.subtasksRoot(boardId, colId, taskId),
                method: 'POST',
                body,
            }),
        }),

        updateSubtask: builder.mutation<
            UpdateSubtaskResponse,
            UpdateSubtaskArgs
        >({
            query: ({ boardId, colId, taskId, subtaskId, body }) => ({
                url: taskRoutes.subtaskById(boardId, colId, taskId, subtaskId),
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'Task', id: taskId },
            ],
        }),

        deleteSubtask: builder.mutation<
            DeleteSubtaskResponse,
            DeleteSubtaskArgs
        >({
            query: ({ boardId, colId, taskId, subtaskId }) => ({
                url: taskRoutes.subtaskById(boardId, colId, taskId, subtaskId),
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'Task', id: taskId },
            ],
        }),

        getTaskAttachmentPresignedUrl: builder.mutation<
            GetTaskAttachmentPresignedUrlResponse,
            GetTaskAttachmentPresignedUrlArgs
        >({
            query: ({ boardId, colId, taskId, body }) => ({
                url: taskRoutes.attachmentsPresignUpload(
                    boardId,
                    colId,
                    taskId,
                ),
                method: 'POST',
                body,
            }),
        }),

        completeTaskAttachment: builder.mutation<
            CompleteTaskAttachmentResponse,
            CompleteTaskAttachmentArgs
        >({
            query: ({ boardId, colId, taskId, attachmentId }) => ({
                url: taskRoutes.attachmentsComplete(
                    boardId,
                    colId,
                    taskId,
                    attachmentId,
                ),
                method: 'POST',
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'Task', id: taskId },
            ],
        }),

        getDownloadPresignedUrl: builder.query<
            GetDownloadPresignedUrlResponse,
            GetDownloadPresignedUrlArgs
        >({
            query: ({ boardId, colId, taskId, attachmentId }) => ({
                url: taskRoutes.attachmentsPresignDownload(
                    boardId,
                    colId,
                    taskId,
                    attachmentId,
                ),
                method: 'GET',
            }),
        }),

        deleteTaskAttachment: builder.mutation<
            DeleteTaskAttachmentResponse,
            DeleteTaskAttachmentArgs
        >({
            query: ({ boardId, colId, taskId, attachmentId }) => ({
                url: taskRoutes.attachmentById(
                    boardId,
                    colId,
                    taskId,
                    attachmentId,
                ),
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'Task', id: taskId },
            ],
        }),

        getComments: builder.query<GetCommentsResponse, GetCommentsArgs>({
            query: ({ boardId, colId, taskId }) => ({
                url: taskRoutes.commentsRoot(boardId, colId, taskId),
                method: 'GET',
            }),
            providesTags: (_, __, { taskId }) => [
                { type: 'TaskComments', id: taskId },
            ],
        }),

        addComment: builder.mutation<AddCommentResponse, AddCommentArgs>({
            query: ({ boardId, colId, taskId, body }) => ({
                url: taskRoutes.commentsRoot(boardId, colId, taskId),
                method: 'POST',
                body,
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'TaskComments', id: taskId },
            ],
        }),

        editComment: builder.mutation<EditCommentResponse, EditCommentArgs>({
            query: ({ boardId, colId, taskId, comId, body }) => ({
                url: taskRoutes.commentById(boardId, colId, taskId, comId),
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'TaskComments', id: taskId },
            ],
        }),

        deleteComment: builder.mutation<
            DeleteCommentResponse,
            DeleteCommentArgs
        >({
            query: ({ boardId, colId, taskId, comId }) => ({
                url: taskRoutes.commentById(boardId, colId, taskId, comId),
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, { taskId }) => [
                { type: 'TaskComments', id: taskId },
            ],
        }),
    }),
    overrideExisting: false,
});

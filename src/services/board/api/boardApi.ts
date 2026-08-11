import { baseApi } from '@/shared/api/baseApi';
import { boardRoutes } from './routes';

import type {
    CompleteUploadImageArgs,
    CompleteUploadImageResponse,
} from './contracts/complete-upload-image';
import type {
    CreateBoardArgs,
    CreateBoardResponse,
} from './contracts/create-board';
import type {
    DeleteBoardArgs,
    DeleteBoardResponse,
} from './contracts/delete-board';
import type { EditBoardArgs, EditBoardResponse } from './contracts/edit-board';
import type { GetBoardArgs, GetBoardResponse } from './contracts/get-board';
import type {
    PresignUploadImageArgs,
    PresignUploadImageResponse,
} from './contracts/presign-upload-image';
import type {
    GetTaskListArgs,
    GetTaskListResponse,
} from './contracts/get-task-list';

export const boardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBoard: builder.query<GetBoardResponse, GetBoardArgs>({
            query: ({ workspaceId, boardId }) => ({
                url: boardRoutes.byId(workspaceId, boardId),
                method: 'GET',
            }),
            providesTags: (_, __, { boardId }) => [
                { type: 'Board', id: boardId },
            ],
        }),

        createBoard: builder.mutation<CreateBoardResponse, CreateBoardArgs>({
            query: ({ workspaceId, body }) => ({
                url: boardRoutes.root(workspaceId),
                method: 'POST',
                body: {
                    name: body.name,
                    ...(body.template !== 'empty' && {
                        template: body.template,
                    }),
                },
            }),
            invalidatesTags: (_, __, { workspaceId }) => [
                { type: 'Workspace', id: workspaceId },
            ],
        }),

        editBoard: builder.mutation<EditBoardResponse, EditBoardArgs>({
            query: ({ workspaceId, boardId, body }) => ({
                url: boardRoutes.byId(workspaceId, boardId),
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_, __, { workspaceId }) => [
                { type: 'Workspace', id: workspaceId },
            ],
        }),

        deleteBoard: builder.mutation<DeleteBoardResponse, DeleteBoardArgs>({
            query: ({ workspaceId, boardId }) => ({
                url: boardRoutes.byId(workspaceId, boardId),
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, { workspaceId }) => [
                { type: 'Workspace', id: workspaceId },
            ],
        }),

        presignUploadImage: builder.mutation<
            PresignUploadImageResponse,
            PresignUploadImageArgs
        >({
            query: ({ workspaceId, boardId, body }) => ({
                url: boardRoutes.presignUploadImage(workspaceId, boardId),
                method: 'POST',
                body,
            }),
        }),

        completeUploadImage: builder.mutation<
            CompleteUploadImageResponse,
            CompleteUploadImageArgs
        >({
            query: ({ workspaceId, boardId, body }) => ({
                url: boardRoutes.completeUploadAvatar(workspaceId, boardId),
                method: 'POST',
                body,
            }),
            invalidatesTags: (_, __, { workspaceId }) => [
                { type: 'Workspace', id: workspaceId },
            ],
        }),

        getTaskList: builder.query<GetTaskListResponse, GetTaskListArgs>({
            query: ({ workspaceId, boardId }) => ({
                url: boardRoutes.getTaskList(workspaceId, boardId),
                method: 'GET',
            }),
            providesTags: (_, __, { boardId }) => [
                { type: 'TaskList', id: boardId },
            ],
        }),
    }),
    overrideExisting: false,
});

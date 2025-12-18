import { baseApi } from "@/api/baseApi";
import type { IBoard } from "@/shared/types/board.types";

export const boardApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getBoard: builder.query<IBoard, { workspaceId: string, boardId: string }>({
			query: ({ workspaceId, boardId }) => ({
				url: `/workspace/${workspaceId}/board/${boardId}`,
				method: 'GET'
			})
		}),
		createBoard: builder.mutation<IBoard, { workspaceId: string, name: string, description: string }>({
			query: ({ workspaceId, name, description }) => ({
				url: `/workspace/${workspaceId}/board`,
				method: "POST",
				body: {
					name,
					description
				}
			}),
			invalidatesTags: (_, __, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }]
		}),
	}),
	overrideExisting: false
})

export const { useGetBoardQuery, useCreateBoardMutation } = boardApi
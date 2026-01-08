import { baseApi } from "@/api/baseApi";
import type { TBoardRole } from "@/shared/constants/board.permissions";
import type { IBoard, IBoardMember } from "@/shared/types/board.types";

export const boardApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getBoard: builder.query<IBoard, { workspaceId: string, boardId: string }>({
			query: ({ workspaceId, boardId }) => ({
				url: `/workspaces/${workspaceId}/boards/${boardId}`,
				method: 'GET'
			}),
			providesTags: (_, __, { boardId }) => [{ type: 'Board', id: boardId }]
		}),
		createBoard: builder.mutation<IBoard, { workspaceId: string, name: string, description: string }>({
			query: ({ workspaceId, name, description }) => ({
				url: `/workspaces/${workspaceId}/boards`,
				method: "POST",
				body: {
					name,
					description
				}
			}),
			invalidatesTags: (_, __, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }]
		}),
		editBoard: builder.mutation<IBoard, { workspaceId: string, boardId: string, name: string, description: string }>({
			query: ({ workspaceId, boardId, name, description }) => ({
				url: `/workspaces/${workspaceId}/boards/${boardId}`,
				method: "PATCH",
				body: {
					name,
					description
				}
			}),
			invalidatesTags: (_, __, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }]
		}),
		getMyBoardRole: builder.query<TBoardRole, { workspaceId: string, boardId: string }>({
			query: ({ workspaceId, boardId }) => ({
				url: `/workspaces/${workspaceId}/boards/${boardId}/role`,
				method: "GET"
			}),
		}),
		getBoardMembers: builder.query<IBoardMember[], { workspaceId: string, boardId: string }>({
			query: ({ workspaceId, boardId }) => ({
				url: `/workspaces/${workspaceId}/boards/${boardId}/members`,
				method: "GET"
			}),
		}),
	}),
	overrideExisting: false
})

export const { useGetBoardQuery, useCreateBoardMutation, useEditBoardMutation, useGetMyBoardRoleQuery, useGetBoardMembersQuery } = boardApi
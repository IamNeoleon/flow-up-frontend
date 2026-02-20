import { baseApi } from "@/shared/api/baseApi";
import { boardRoutes } from "./boardApi.routes";
import type { IBoardParams, ICreateBoardArgs, IEditBoardArgs } from "./boardApi.types";
import type { TBoardRole } from "../types/board-role";
import type { IBoard } from "../types/board";
import type { IBoardMember } from "../types/board-member";

export const boardApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getBoard: builder.query<IBoard, IBoardParams>({
			query: ({ workspaceId, boardId }) => ({
				url: boardRoutes.byId(workspaceId, boardId),
				method: 'GET'
			}),
			providesTags: (_, __, { boardId }) => [{ type: 'Board', id: boardId }]
		}),
		createBoard: builder.mutation<IBoard, ICreateBoardArgs>({
			query: ({ workspaceId, name, description }) => ({
				url: boardRoutes.root(workspaceId),
				method: "POST",
				body: {
					name,
					description
				}
			}),
			invalidatesTags: (_, __, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }]
		}),
		editBoard: builder.mutation<IBoard, IEditBoardArgs>({
			query: ({ workspaceId, boardId, name, description }) => ({
				url: boardRoutes.byId(workspaceId, boardId),
				method: "PATCH",
				body: {
					name,
					description
				}
			}),
			invalidatesTags: (_, __, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }]
		}),
		deleteBoard: builder.mutation<IBoard, { workspaceId: string, boardId: string }>({
			query: ({ workspaceId, boardId }) => ({
				url: boardRoutes.byId(workspaceId, boardId),
				method: "DELETE"
			}),
			invalidatesTags: (_, __, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }]
		}),
		getMyBoardRole: builder.query<{ role: TBoardRole }, IBoardParams>({
			query: ({ workspaceId, boardId }) => ({
				url: boardRoutes.role(workspaceId, boardId),
				method: "GET"
			}),
		}),
		changeBoardRole: builder.mutation<boolean, { workspaceId: string, boardId: string, targetUserId: string, targetRole: TBoardRole }>({
			query: ({ workspaceId, boardId, targetRole, targetUserId }) => ({
				url: boardRoutes.changeRole(workspaceId, boardId),
				method: "POST",
				body: {
					targetRole,
					targetUserId
				}
			}),
		}),
		getBoardMembers: builder.query<IBoardMember[], IBoardParams>({
			query: ({ workspaceId, boardId }) => ({
				url: boardRoutes.members(workspaceId, boardId),
				method: "GET"
			}),
		}),
	}),
	overrideExisting: false
})

export const {
	useGetBoardQuery,
	useCreateBoardMutation,
	useEditBoardMutation,
	useGetMyBoardRoleQuery,
	useGetBoardMembersQuery,
	useChangeBoardRoleMutation,
	useDeleteBoardMutation
} = boardApi
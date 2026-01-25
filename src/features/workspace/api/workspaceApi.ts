import { baseApi } from "@/shared/api/baseApi";
import type { IWorkspace } from "../types/workspace";
import type { IWorkspaceActivity } from "../types/workspace-activity";
import type { IWorkspaceStat } from "../types/workspace-stat";
import type { IWorkspaceMember } from "../types/workspace-member";
import type { TWorkspaceRole } from "../types/workspace-role";

export const workspaceApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getWorkspaces: builder.query<IWorkspace[], void>({
			query: () => ({
				url: '/workspaces',
				method: 'GET'
			}),
			providesTags: ['Workspace']
		}),
		getWorkspace: builder.query<IWorkspace, string>({
			query: (id) => ({
				url: `/workspaces/${id}`
			}),
			providesTags: (_, __, id) => [{ type: 'Workspace', id }]
		}),
		createWorkspace: builder.mutation<boolean, { name: string }>({
			query: (body) => ({
				url: '/workspaces',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Workspace']
		}),
		updateWorkspace: builder.mutation<IWorkspace, { id: string, title: string, isArchived: boolean, icon: string }>({
			query: (data) => ({
				url: `/workspaces/${data.id}`,
				method: 'PATCH',
				body: { name: data.title, isArchived: data.isArchived, icon: data.icon }
			}),
			invalidatesTags: (_, __, arg) => [{ type: 'Workspace', id: arg.id }]
		}),
		getWorkspaceMembers: builder.query<IWorkspaceMember[], string>({
			query: (id) => ({
				url: `/workspaces/${id}/members`
			}),
			providesTags: (_, __, workspaceId) => [
				{ type: 'WorkspaceMember', id: workspaceId }
			]
		}),
		addMember: builder.mutation<{ inviteUrl: string }, { role: TWorkspaceRole, id: string }>({
			query: (data) => ({
				url: `/workspaces/${data.id}/invite-link`,
				method: 'POST',
				body: {
					role: data.role,
					expiresIn: 1
				}
			}),
			invalidatesTags: (_, __, { id }) => [
				{ type: 'WorkspaceMember', id }
			]
		}),
		checkInvite: builder.query<{ workspaceId: string, role: TWorkspaceRole }, string>({
			query: (token) => ({
				url: `/workspaces/invite/${token}`
			})
		}),
		joinWorkspace: builder.mutation<boolean | { message: string }, string>({
			query: (token) => ({
				url: `/workspaces/invite/${token}/accept`,
				method: 'POST',
			}),
		}),
		getMyWorkspaceRole: builder.query<TWorkspaceRole, string>({
			query: (workspaceId) => ({
				url: `/workspaces/${workspaceId}/role`,
				method: 'GET',
				responseHandler: 'text'
			})
		}),
		changeMemberRole: builder.mutation<IWorkspaceMember, { workspaceId: string, userId: string, role: TWorkspaceRole }>({
			query: ({ workspaceId, userId, role }) => ({
				url: `/workspaces/${workspaceId}/members/${userId}`,
				method: 'PATCH',
				body: {
					role
				}
			}),
			invalidatesTags: (_, __, { workspaceId }) => [
				{ type: 'WorkspaceMember', id: workspaceId }
			]
		}),
		deleteMember: builder.mutation<IWorkspaceMember, { workspaceId: string, userId: string }>({
			query: ({ workspaceId, userId }) => ({
				url: `/workspaces/${workspaceId}/members/${userId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_, __, { workspaceId }) => [
				{ type: 'WorkspaceMember', id: workspaceId }
			]
		}),
		getActivity: builder.query<IWorkspaceActivity[], string>({
			query: (id) => ({
				url: `/workspaces/${id}/activity`
			}),
		}),
		getStatistic: builder.query<IWorkspaceStat, string>({
			query: (id) => ({
				url: `/workspaces/${id}/statistic`
			}),
		}),
	}),
	overrideExisting: false
})

export const {
	useGetWorkspacesQuery,
	useGetWorkspaceQuery,
	useCreateWorkspaceMutation,
	useUpdateWorkspaceMutation,
	useGetWorkspaceMembersQuery,
	useAddMemberMutation,
	useCheckInviteQuery,
	useJoinWorkspaceMutation,
	useGetMyWorkspaceRoleQuery,
	useChangeMemberRoleMutation,
	useDeleteMemberMutation,
	useGetActivityQuery,
	useGetStatisticQuery,
	useLazyGetWorkspaceMembersQuery
} = workspaceApi
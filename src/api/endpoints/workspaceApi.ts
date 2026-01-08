import { baseApi } from "@/api/baseApi";
import { type IWorkspace, type ICreateWorkspaceBody, type IWorkspaceMember, type TWorkspaceRole } from "@/shared/types/workspace.types";

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
		createWorkspace: builder.mutation<boolean, ICreateWorkspaceBody>({
			query: (body) => ({
				url: '/workspaces',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Workspace']
		}),
		getWorkspaceMembers: builder.query<IWorkspaceMember[], string>({
			query: (id) => ({
				url: `/workspaces/${id}/members`
			}),
			providesTags: ['WorkspaceMember']
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
			invalidatesTags: ['WorkspaceMember']
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
			invalidatesTags: ['WorkspaceMember']
		}),
		getMyWorkspaceRole: builder.query<TWorkspaceRole, string>({
			query: (workspaceId) => ({
				url: `/workspaces/${workspaceId}/role`,
				responseHandler: 'text'
			})
		}),
	}),
	overrideExisting: false
})

export const {
	useGetWorkspacesQuery,
	useGetWorkspaceQuery,
	useCreateWorkspaceMutation,
	useGetWorkspaceMembersQuery,
	useAddMemberMutation,
	useCheckInviteQuery,
	useJoinWorkspaceMutation,
	useGetMyWorkspaceRoleQuery
} = workspaceApi
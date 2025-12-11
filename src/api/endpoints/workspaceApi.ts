import { baseApi } from "@/api/baseApi";
import { type IWorkspace, type ICreateWorkspaceBody } from "@/shared/types/workspace.types";

export const workspaceApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getWorkspaces: builder.query<IWorkspace[], void>({
			query: () => ({
				url: '/workspace',
				method: 'GET'
			}),
			providesTags: ['Workspace']
		}),
		getWorkspace: builder.query<IWorkspace, string>({
			query: (id) => ({
				url: `/workspace/${id}`
			})
		}),
		createWorkspace: builder.mutation<boolean, ICreateWorkspaceBody>({
			query: (body) => ({
				url: '/workspace',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Workspace']
		})
	}),
	overrideExisting: false
})

export const { useGetWorkspacesQuery, useGetWorkspaceQuery, useCreateWorkspaceMutation } = workspaceApi
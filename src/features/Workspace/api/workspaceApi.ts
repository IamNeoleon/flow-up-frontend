import { baseApi } from "@/api/baseApi";
import type { ICreateWorkspaceBody, IWorkspace } from "../types";


export const workspaceApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getWorkspaces: builder.query<IWorkspace[], void>({
			query: () => ({
				url: '/workspace',
				method: 'GET'
			}),
			providesTags: ['Workspace']
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

export const { useGetWorkspacesQuery, useCreateWorkspaceMutation } = workspaceApi
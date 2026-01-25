import { baseApi } from "@/shared/api/baseApi";
import type { IRegisterBody, ILoginBody } from "@/features/auth/types/";

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation<boolean, IRegisterBody>({
			query: (body) => ({
				url: '/auth/register',
				method: "POST",
				body
			})
		}),
		login: builder.mutation<{ accessToken: string }, ILoginBody>({
			query: (body) => ({
				url: '/auth/login',
				method: "POST",
				body
			}),
			invalidatesTags: ['User']
		}),
		refresh: builder.mutation<{ accessToken: string }, void>({
			query: (body) => ({
				url: '/auth/refresh',
				method: "POST",
				body
			}),
		}),
		googleLogin: builder.query<null, void>({
			query: () => ({
				url: '/auth/google/login',
				method: "GET",
			}),
		})
	}),
	overrideExisting: false
})

export const {
	useRegisterMutation,
	useLoginMutation,
	useRefreshMutation,
	useLazyGoogleLoginQuery
} = authApi

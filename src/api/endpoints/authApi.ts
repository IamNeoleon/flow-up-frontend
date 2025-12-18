import { baseApi } from "@/api/baseApi";
import type { IRegisterBody, ILoginBody } from "@/features/auth/types/";
import type { IUser } from "@/shared/types/user.types";

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
			})
		}),
		getMe: builder.query<IUser, void>({
			query: () => ({
				url: '/me',
				method: "GET",
			})
		})
	}),
	overrideExisting: false
})

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi
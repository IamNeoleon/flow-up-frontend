import { baseApi } from "@/api/baseApi";
import type { IRegisterBody, ILoginBody } from "../types";

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
	}),
	overrideExisting: false
})

export const { useRegisterMutation, useLoginMutation } = authApi
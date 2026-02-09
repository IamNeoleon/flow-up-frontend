import { logout, setToken } from "@/store/slices/authSlice";
import {
	createApi,
	fetchBaseQuery,
	type BaseQueryFn,
	type FetchArgs,
	type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { getTokenFromLs } from "../lib/localStorage";

const API_URL = import.meta.env.VITE_API_URL;

const rawBaseQuery = fetchBaseQuery({
	baseUrl: `${API_URL}/api`,
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const tokenFromState = (getState() as RootState).auth.token;
		const tokenFromLs = getTokenFromLs()

		if (tokenFromState) {
			headers.set("Authorization", `Bearer ${tokenFromState}`);
		} else if (tokenFromLs) {
			headers.set("Authorization", `Bearer ${tokenFromLs}`);
		}

		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await rawBaseQuery(args, api, extraOptions);

	if (result.error?.status === 401) {
		const refreshResult = await rawBaseQuery(
			{ url: "/auth/refresh", method: "POST" },
			api,
			extraOptions
		);

		if (refreshResult.data) {
			const { accessToken } = refreshResult.data as { accessToken: string };

			api.dispatch(setToken(accessToken))

			result = await rawBaseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout())
		}
	}

	return result;
};

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithReauth,
	tagTypes: [
		"Board",
		"User",
		"Auth",
		"Workspace",
		"WorkspaceMember",
		"Columns",
		"Task",
		"TaskComments",
		'Notifications',
		'WorkspaceActivity',
		'WorkspaceStatistics'
	],
	endpoints: () => ({}),
});

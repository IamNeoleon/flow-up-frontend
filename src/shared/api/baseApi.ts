import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/shared/constants/api-url';
import { logout, setEmailVerified, setToken } from '@/store/slices/auth-slice';
import { getTokenFromLs } from '../lib/localStorage';

import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const tokenFromState = (getState() as RootState).auth.token;
        const tokenFromLs = getTokenFromLs();

        if (tokenFromState) {
            headers.set('Authorization', `Bearer ${tokenFromState}`);
        } else if (tokenFromLs) {
            headers.set('Authorization', `Bearer ${tokenFromLs}`);
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
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            const { accessToken } = refreshResult.data as {
                accessToken: string;
            };

            api.dispatch(setToken(accessToken));

            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    if (result.error?.status === 403) {
        const errorData = result.error.data as { code?: string };
        if (errorData?.code === 'EMAIL_NOT_VERIFIED') {
            api.dispatch(setEmailVerified(false));
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'Board',
        'User',
        'Auth',
        'Workspace',
        'WorkspaceMember',
        'Columns',
        'Task',
        'TaskComments',
        'Notifications',
        'WorkspaceActivity',
        'WorkspaceStatistics',
        'TasksRecent',
        'Priorities',
        'TaskList',
    ],
    endpoints: () => ({}),
});

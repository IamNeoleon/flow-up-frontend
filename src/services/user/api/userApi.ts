import { baseApi } from "@/shared/api/baseApi";
import type { IUser } from "../types/user";

type PresignAvatarResp = {
   uploadUrl: string;
   publicUrl: string;
   key: string;
   method: "PUT";
};

export const userApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getMe: builder.query<IUser, void>({
         query: () => ({
            url: '/users/me',
            method: "GET",
         }),
         providesTags: ['User']
      }),
      presignUploadAvatar: builder.mutation<PresignAvatarResp, { mimeType: string }>({
         query: ({ mimeType }) => ({
            url: "/users/me/avatar/presign-upload",
            method: "POST",
            body: { mimeType },
         }),
      }),
      completeUploadAvatar: builder.mutation<IUser, { key: string }>({
         query: ({ key }) => ({
            url: "/users/me/avatar/complete",
            method: "POST",
            body: {
               key
            }
         }),
         invalidatesTags: ["User"],
      }),
   }),
   overrideExisting: false,
});

export const {
   useGetMeQuery,
   usePresignUploadAvatarMutation,
   useCompleteUploadAvatarMutation,
} = userApi;

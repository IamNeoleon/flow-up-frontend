import { baseApi } from "@/shared/api/baseApi";
import type { Notification } from "../types/notification";


export const notificationApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getAllNotifications: builder.query<Notification[], void>({
         query: () => ({
            url: '/notifications',
            method: 'GET'
         }),
         providesTags: ['Notifications']
      }),
      markNotification: builder.mutation<Notification, { id: string }>({
         query: ({ id }) => ({
            url: `/notifications/${id}`,
            method: "PATCH",
         }),
         async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
            const patch = dispatch(
               notificationApi.util.updateQueryData("getAllNotifications", undefined, (draft) => {
                  const n = draft.find((x) => x.id === id)
                  if (n) n.read = true
               })
            )

            try {
               const { data } = await queryFulfilled

               dispatch(
                  notificationApi.util.updateQueryData("getAllNotifications", undefined, (draft) => {
                     const idx = draft.findIndex((x) => x.id === id)
                     if (idx !== -1) draft[idx] = data
                  })
               )
            } catch {
               patch.undo()
            }
         },
      }),

   })
})

export const { useGetAllNotificationsQuery, useMarkNotificationMutation } = notificationApi
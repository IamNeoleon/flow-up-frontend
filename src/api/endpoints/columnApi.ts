import type { ITask } from "@/shared/types/task.types";
import { baseApi } from "../baseApi";
import type { IColumn } from "@/shared/types/column.types";

export const columnApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createColumn: builder.mutation<ITask, { boardId: string, name: string }>({
         query: ({ boardId, name }) => ({
            url: `/boards/${boardId}/columns`,
            method: "POST",
            body: {
               name
            }
         }),
         invalidatesTags: (_, __, { boardId }) => [{ type: 'Board', id: boardId }]
      }),
      changeOrder: builder.mutation<IColumn, { boardId: string, colId: string, newOrder: number }>({
         query: ({ boardId, colId, newOrder }) => ({
            url: `/boards/${boardId}/columns/${colId}`,
            method: "PATCH",
            body: {
               newOrder
            }
         }),
      }),
   }),
   overrideExisting: false
})

export const { useCreateColumnMutation, useChangeOrderMutation } = columnApi;
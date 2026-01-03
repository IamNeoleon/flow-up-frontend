import { baseApi } from "../baseApi";
import type { IColumn } from "@/shared/types/column.types";
import { reorderColumns } from "@/shared/lib/utils/reorderColumns";

export const columnApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getAllColumns: builder.query<IColumn[], string>({
         query: (boardId) => ({
            url: `/boards/${boardId}/columns`,
            method: "GET",
         }),
         providesTags: (result, _, boardId) =>
            result ? [
               ...result.map(col => ({ type: 'Columns' as const, id: col.id })),
               { type: 'Columns', id: `LIST-${boardId}` },
            ] : [{ type: 'Columns', id: `LIST-${boardId}` }],
      }),
      createColumn: builder.mutation<IColumn, { boardId: string, name: string }>({
         query: ({ boardId, name }) => ({
            url: `/boards/${boardId}/columns`,
            method: "POST",
            body: {
               name
            }
         }),
         invalidatesTags: (_, __, { boardId }) => [
            { type: 'Columns', id: `LIST-${boardId}` }
         ]
      }),
      changeOrder: builder.mutation<IColumn, { boardId: string, colId: string, newOrder: number, activeId: string, overId: string }>({
         query: ({ boardId, colId, newOrder }) => ({
            url: `/boards/${boardId}/columns/${colId}/change-order`,
            method: "PATCH",
            body: {
               newOrder
            }
         }),
         async onQueryStarted({ boardId, activeId, overId }, { dispatch, queryFulfilled }) {
            const patch = dispatch(
               columnApi.util.updateQueryData("getAllColumns", boardId, (draft) => {
                  reorderColumns(draft, activeId, overId);
               })
            );

            try {
               await queryFulfilled;
            } catch {
               patch.undo();
            }
         },
      }),
      editColumn: builder.mutation<IColumn, { boardId: string, colId: string, name: string, color?: string }>({
         query: ({ boardId, colId, name, color }) => ({
            url: `/boards/${boardId}/columns/${colId}`,
            method: "PATCH",
            body: {
               name,
               color
            }
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      })
   }),
   overrideExisting: false
})

export const { useCreateColumnMutation, useChangeOrderMutation, useEditColumnMutation, useGetAllColumnsQuery } = columnApi;
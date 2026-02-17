import { baseApi } from "@/shared/api/baseApi";
import { columnRoutes } from "./columnApi.routes";
import type { IColumn } from "../types/column";
import type { IChangeOrderColumnArgs, ICreateColumnArgs, IDeleteColumnArgs, IEditColumnArgs } from "./columnApi.types";

export const columnApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getAllColumns: builder.query<IColumn[], string>({
         query: (boardId) => ({
            url: columnRoutes.root(boardId),
            method: "GET",
         }),
         providesTags: (result, _, boardId) =>
            result ? [
               ...result.map(col => ({ type: 'Columns' as const, id: col.id })),
               { type: 'Columns', id: `LIST-${boardId}` },
            ] : [{ type: 'Columns', id: `LIST-${boardId}` }],
      }),
      createColumn: builder.mutation<IColumn, ICreateColumnArgs>({
         query: ({ boardId, name, color, status }) => ({
            url: columnRoutes.root(boardId),
            method: "POST",
            body: {
               name,
               color,
               status
            }
         }),
         invalidatesTags: (_, __, { boardId }) => [
            { type: 'Columns', id: `LIST-${boardId}` }
         ]
      }),
      changeOrder: builder.mutation<IColumn, IChangeOrderColumnArgs>({
         query: ({ boardId, colId, newOrder }) => ({
            url: columnRoutes.changeOrder(boardId, colId),
            method: "PATCH",
            body: {
               newOrder
            }
         }),
         invalidatesTags: (_, __, { boardId }) => [
            { type: 'Columns', id: `LIST-${boardId}` }
         ]
      }),
      editColumn: builder.mutation<IColumn, IEditColumnArgs>({
         query: ({ boardId, colId, name, color, status }) => ({
            url: columnRoutes.byId(boardId, colId),
            method: "PATCH",
            body: {
               name,
               color,
               status
            }
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      }),
      deleteColumn: builder.mutation<boolean, IDeleteColumnArgs>({
         query: ({ boardId, colId }) => ({
            url: columnRoutes.byId(boardId, colId),
            method: "DELETE",
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      })
   }),
   overrideExisting: false
})

export const {
   useCreateColumnMutation,
   useChangeOrderMutation,
   useEditColumnMutation,
   useGetAllColumnsQuery,
   useDeleteColumnMutation
} = columnApi;
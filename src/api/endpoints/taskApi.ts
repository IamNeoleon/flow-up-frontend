import type { ITask } from "@/shared/types/task.types";
import { baseApi } from "../baseApi";

export const taskApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createTask: builder.mutation<ITask, { boardId: string, colId: string, name: string }>({
         query: ({ colId, name }) => ({
            url: `/columns/${colId}/tasks`,
            method: "POST",
            body: {
               name
            }
         }),
         invalidatesTags: (_, __, { boardId }) => [{ type: 'Board', id: boardId }]
      }),
      moveTask: builder.mutation<ITask, { colId: string, targetColId: string, taskId: string }>({
         query: ({ colId, targetColId, taskId }) => ({
            url: `/columns/${colId}/tasks/${taskId}`,
            method: "PATCH",
            body: {
               targetColId
            }
         })
      })
   }),
   overrideExisting: false
})

export const { useCreateTaskMutation, useMoveTaskMutation } = taskApi;
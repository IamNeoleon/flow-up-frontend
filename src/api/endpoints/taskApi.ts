import type { ITask, ITaskPriority, ITaskTodo } from "@/shared/types/task.types";
import { baseApi } from "../baseApi";
import type { IUpdateTaskDto } from "@/features/tasks/types";
import { columnApi } from "./columnApi";
import { moveTask } from "@/shared/lib/moveTask";

export const taskApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getTaskById: builder.query<ITask, { colId: string, taskId: string }>({
         query: ({ colId, taskId }) => ({
            url: `/columns/${colId}/tasks/${taskId}`,
            method: 'GET'
         }),
         providesTags: (_, __, { taskId }) => [
            { type: "Task", id: taskId },
         ],
      }),
      createTask: builder.mutation<ITask, { boardId: string, colId: string, name: string }>({
         query: ({ colId, name }) => ({
            url: `/columns/${colId}/tasks`,
            method: "POST",
            body: {
               name
            }
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      }),
      updateTask: builder.mutation<ITask, { colId: string, taskId: string, data: IUpdateTaskDto }>({
         query: ({ colId, taskId, data }) => ({
            url: `/columns/${colId}/tasks/${taskId}`,
            method: "PATCH",
            body: {
               ...data
            },
         }),
         async onQueryStarted(
            { colId, taskId, data },
            { dispatch, queryFulfilled }
         ) {
            const patch = dispatch(
               taskApi.util.updateQueryData(
                  "getTaskById",
                  { colId, taskId },
                  (draft) => {
                     if (!draft) return;
                     if (data.name !== undefined) draft.name = data.name;
                     if (data.priorityId !== undefined) draft.priorityId = data.priorityId;
                     if (data.dueDate !== undefined) draft.dueDate = data.dueDate;
                  }
               )
            );

            try {
               await queryFulfilled;
            } catch {
               patch.undo();
            }
         },
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId },
         ]
      }),
      deleteTask: builder.mutation<boolean, { colId: string, taskId: string }>({
         query: ({ colId, taskId }) => ({
            url: `/columns/${colId}/tasks/${taskId}`,
            method: "DELETE"
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      }),
      moveTask: builder.mutation<ITask, { colId: string, targetColId: string, taskId: string, boardId: string }>({
         query: ({ colId, targetColId, taskId }) => ({
            url: `/columns/${colId}/tasks/${taskId}/move`,
            method: "PATCH",
            body: {
               targetColId
            }
         }),
         async onQueryStarted({ boardId, taskId, targetColId }, { dispatch, queryFulfilled }) {
            const patch = dispatch(
               columnApi.util.updateQueryData("getAllColumns", boardId, (draft) => {
                  moveTask(taskId, targetColId, draft);
               })
            );

            try {
               await queryFulfilled;
            } catch {
               patch.undo();
            }
         },
      }),
      getPriorities: builder.query<ITaskPriority[], string>({
         query: (colId) => ({
            url: `/columns/${colId}/tasks/priorities`,
            method: "GET"
         })
      }),
      createSubtask: builder.mutation<ITaskTodo, { colId: string, taskId: string, title: string }>({
         query: ({ colId, taskId, title }) => ({
            url: `/columns/${colId}/tasks/${taskId}/subtasks`,
            method: 'POST',
            body: {
               title
            }
         }),
      }),
      updateSubtask: builder.mutation<ITaskTodo, { colId: string, taskId: string, subtaskId: string, title?: string, completed?: boolean }>({
         query: ({ colId, taskId, subtaskId, title, completed }) => ({
            url: `/columns/${colId}/tasks/${taskId}/subtasks/${subtaskId}`,
            method: 'PATCH',
            body: {
               title,
               completed
            }
         }),
         invalidatesTags: (_, __, { taskId }) => [
            { type: "Task", id: taskId },
         ],
      }),
      deleteSubtask: builder.mutation<boolean, { colId: string, taskId: string, subtaskId: string }>({
         query: ({ colId, taskId, subtaskId }) => ({
            url: `/columns/${colId}/tasks/${taskId}/subtasks/${subtaskId}`,
            method: 'DELETE',
         }),
         invalidatesTags: (_, __, { taskId }) => [
            { type: "Task", id: taskId },
         ],
      }),
   }),
   overrideExisting: false
})

export const {
   useCreateTaskMutation,
   useUpdateTaskMutation,
   useMoveTaskMutation,
   useGetPrioritiesQuery,
   useCreateSubtaskMutation,
   useUpdateSubtaskMutation,
   useGetTaskByIdQuery,
   useDeleteTaskMutation,
   useDeleteSubtaskMutation
} = taskApi;
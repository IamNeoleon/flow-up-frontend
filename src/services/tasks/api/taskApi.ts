import { baseApi } from "../../../shared/api/baseApi";
import { taskRoutes } from "./taskApi.routes";

import type { ITask } from "../types/task";
import type { ITaskPriority } from "../types/task-priority";
import type { ITaskTodo } from "../types/task-todo";
import type { IUpdateTaskDto } from "@/services/tasks/types";
import type { ITaskPresignedAtchBody, ITaskPresignedAtchResponse } from "../types/task-attachments";
import type { IUser } from "@/services/user/types/user";

import { columnApi } from "@/services/column/api/columnApi";
import { moveTask } from "@/services/tasks/lib/move-task";
import type { ITaskComment } from "../types/task-comment";

export const taskApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getTaskById: builder.query<ITask, { boardId: string, colId: string, taskId: string }>({
         query: ({ boardId, colId, taskId }) => ({
            url: taskRoutes.byId(boardId, colId, taskId),
            method: 'GET'
         }),
         providesTags: (_, __, { taskId }) => [
            { type: "Task", id: taskId },
         ],
      }),
      createTask: builder.mutation<ITask, { boardId: string, colId: string, name: string }>({
         query: ({ boardId, colId, name }) => ({
            url: taskRoutes.root(boardId, colId),
            method: "POST",
            body: {
               name
            }
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      }),
      updateTask: builder.mutation<ITask, { boardId: string, colId: string, taskId: string, assignee: Pick<IUser, 'id' | 'username' | 'avatar'> | null | undefined, data: IUpdateTaskDto }>({
         query: ({ boardId, colId, taskId, data, assignee }) => ({
            url: taskRoutes.byId(boardId, colId, taskId),
            method: "PATCH",
            body: {
               name: data.name,
               priorityId: data.priorityId,
               dueDate: data.dueDate,
               description: data.description,
               assigneeId: assignee?.id ?? null,
            },
         }),
         async onQueryStarted(
            { boardId, colId, taskId, data, assignee },
            { dispatch, queryFulfilled }
         ) {
            const patch = dispatch(
               taskApi.util.updateQueryData(
                  "getTaskById",
                  { boardId, colId, taskId, },
                  (draft) => {
                     if (!draft) return;
                     if (data.name !== undefined) draft.name = data.name;
                     if (data.priorityId !== undefined) draft.priorityId = data.priorityId;
                     if (data.dueDate !== undefined) draft.dueDate = data.dueDate;
                     if (data.description !== undefined) draft.description = data.description;
                     if (data.assigneeId !== undefined) draft.assigneeId = data.assigneeId;
                     if (assignee !== undefined) draft.assignee = assignee;
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
      deleteTask: builder.mutation<boolean, { boardId: string, colId: string, taskId: string }>({
         query: ({ boardId, colId, taskId }) => ({
            url: taskRoutes.byId(boardId, colId, taskId),
            method: "DELETE"
         }),
         invalidatesTags: (_, __, { colId }) => [
            { type: 'Columns', id: colId }
         ]
      }),
      moveTask: builder.mutation<ITask, { boardId: string, colId: string, targetColId: string, taskId: string }>({
         query: ({ boardId, colId, targetColId, taskId }) => ({
            url: taskRoutes.move(boardId, colId, taskId),
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
      getPriorities: builder.query<ITaskPriority[], { boardId: string, colId: string }>({
         query: ({ boardId, colId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/priorities`,
            method: "GET"
         })
      }),
      createSubtask: builder.mutation<ITaskTodo, { boardId: string, colId: string, taskId: string, title: string }>({
         query: ({ boardId, colId, taskId, title }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/subtasks`,
            method: 'POST',
            body: {
               title
            }
         }),
      }),
      updateSubtask: builder.mutation<ITaskTodo, { boardId: string, colId: string, taskId: string, subtaskId: string, title?: string, completed?: boolean }>({
         query: ({ boardId, colId, taskId, subtaskId, title, completed }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/subtasks/${subtaskId}`,
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
      deleteSubtask: builder.mutation<boolean, { boardId: string, colId: string, taskId: string, subtaskId: string }>({
         query: ({ boardId, colId, taskId, subtaskId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/subtasks/${subtaskId}`,
            method: 'DELETE',
         }),
         invalidatesTags: (_, __, { taskId }) => [
            { type: "Task", id: taskId },
         ],
      }),
      getTaskAttachmentPresignedUrl: builder.mutation<ITaskPresignedAtchResponse, { boardId: string, colId: string, taskId: string, body: ITaskPresignedAtchBody }>({
         query: ({ boardId, colId, taskId, body }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/attachments/presign-upload`,
            method: 'POST',
            body: {
               ...body
            }
         }),
      }),
      completeTaskAttachment: builder.mutation<boolean, { boardId: string; colId: string; taskId: string; attachmentId: string }>({
         query: ({ boardId, colId, taskId, attachmentId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/attachments/${attachmentId}/complete`,
            method: "POST",
         }),
         invalidatesTags: (_, __, { taskId }) => [{ type: "Task", id: taskId }],
      }),
      getDownloadPresignedUrl: builder.query<{ method: string, url: string }, { boardId: string; colId: string; taskId: string; attachmentId: string }>({
         query: ({ boardId, colId, taskId, attachmentId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/attachments/${attachmentId}/presign-download`,
            method: "GET",
         }),
      }),
      deleteTaskAttachment: builder.mutation<boolean, { boardId: string; colId: string; taskId: string; attachmentId: string }>({
         query: ({ boardId, colId, taskId, attachmentId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/attachments/${attachmentId}`,
            method: "DELETE",
         }),
         invalidatesTags: (_, __, { taskId }) => [{ type: "Task", id: taskId }],
      }),
      getComments: builder.query<ITaskComment[], { boardId: string, colId: string, taskId: string }>({
         query: ({ boardId, colId, taskId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/comments`,
            method: "GET",
         }),
         providesTags: (_, __, { taskId }) => [
            { type: "TaskComments", id: taskId },
         ],
      }),
      addComment: builder.mutation<ITaskComment, { boardId: string; colId: string; taskId: string, content: string }>({
         query: ({ boardId, colId, taskId, content }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/comments`,
            method: "POST",
            body: {
               content
            }
         }),
         invalidatesTags: (_, __, { taskId }) => [
            { type: "TaskComments", id: taskId },
         ],
      }),
      editComment: builder.mutation<ITaskComment, { boardId: string; colId: string; taskId: string, comId: string, content: string }>({
         query: ({ boardId, colId, taskId, comId, content }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/comments/${comId}`,
            method: "PATCH",
            body: {
               content
            }
         }),
         invalidatesTags: (_, __, { taskId }) => [
            { type: "TaskComments", id: taskId },
         ],
      }),
      deleteComment: builder.mutation<ITaskComment, { boardId: string; colId: string; taskId: string, comId: string }>({
         query: ({ boardId, colId, taskId, comId }) => ({
            url: `/boards/${boardId}/columns/${colId}/tasks/${taskId}/comments/${comId}`,
            method: "DELETE",
         }),
         invalidatesTags: (_, __, { taskId }) => [
            { type: "TaskComments", id: taskId },
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
   useDeleteSubtaskMutation,
   useGetTaskAttachmentPresignedUrlMutation,
   useCompleteTaskAttachmentMutation,
   useLazyGetDownloadPresignedUrlQuery,
   useDeleteTaskAttachmentMutation,
   useGetCommentsQuery,
   useAddCommentMutation,
   useEditCommentMutation,
   useDeleteCommentMutation
} = taskApi;
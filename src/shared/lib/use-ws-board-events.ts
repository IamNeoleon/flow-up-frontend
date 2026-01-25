import { columnApi } from "@/features/column/api/columnApi"
import type { IBoardEvents } from "../types/ws-events"
import { useAppDispatch } from "../hooks/redux"
import { taskApi } from "@/features/tasks/api/taskApi"

export const useWsBoardEvents = (userId: string | undefined) => {
   const dispatch = useAppDispatch()

   const onTaskCreated = (event: IBoardEvents["TASK_CREATED"]) => {

      console.log("TASK_CREATED", event)
      if (event.actorId === userId) return


      dispatch(
         columnApi.util.invalidateTags([{ type: "Columns", id: event.colId }])
      )
   }

   const onTaskUpdated = (event: IBoardEvents["TASK_UPDATED"]) => {

      console.log("TASK_UPDATED", event)
      if (event.actorId === userId) return


      dispatch(
         taskApi.util.invalidateTags([{ type: 'Task', id: event.taskId }])
      )
   }

   const onTaskDeleted = (event: IBoardEvents["TASK_DELETED"]) => {

      console.log("TASK_DELETED", event)
      if (event.actorId === userId) return


      dispatch(
         columnApi.util.invalidateTags([{ type: "Columns", id: event.colId }])
      )
   }

   return {
      onTaskCreated,
      onTaskUpdated,
      onTaskDeleted
   }
}
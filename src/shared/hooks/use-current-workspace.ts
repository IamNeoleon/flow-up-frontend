import { useGetWorkspaceQuery } from "@/features/workspace/api/workspaceApi"
import { skipToken } from "@reduxjs/toolkit/query"

export const useCurrentWorkspace = (workspaceId: string | undefined) => {
   const { data } = useGetWorkspaceQuery(workspaceId ? workspaceId : skipToken)

   return {
      currentWorkspace: data ?? null
   }
}
import { useGetWorkspaceQuery } from "@/api/endpoints/workspaceApi"
import { skipToken } from "@reduxjs/toolkit/query"

export const useCurrentWorkspace = (workspaceId: string | undefined) => {
   const { data } = useGetWorkspaceQuery(workspaceId ? workspaceId : skipToken)

   return {
      currentWorkspace: data ?? null
   }
}
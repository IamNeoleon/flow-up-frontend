import { baseApi } from "@/shared/api/baseApi";
import type { IStatResponse } from "../types";

export const statisticApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getFullStat: builder.query<IStatResponse, string>({
         query: (workspaceId) => ({
            url: `/workspaces/${workspaceId}/statistics-full`,
            method: "GET",
         }),
      })
   }),
   overrideExisting: false
})

export const {
   useGetFullStatQuery
} = statisticApi

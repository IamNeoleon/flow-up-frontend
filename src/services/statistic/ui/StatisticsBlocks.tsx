import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFullStatQuery } from "../api/statisticsApi";
import { BarStatistics } from "./charts/BarStatistics";
import { LineStatistics } from "./charts/LineStatistics";

interface IProps {
   workspaceId: string | undefined;
}

export const StatisticBlocks = ({ workspaceId }: IProps) => {
   const { data } = useGetFullStatQuery(workspaceId ?? skipToken);

   return (
      <div className="flex flex-col gap-5">
         <BarStatistics data={data?.cumulative} />

         {/* 2. Line chart “Дедлайны и просрочки” */}
         <LineStatistics data={data?.flow} />
      </div>
   );
};

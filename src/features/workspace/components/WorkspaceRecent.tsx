import { useGetActivityQuery } from "../api/workspaceApi";
import { ActivityFeed } from "./WorkspaceActivityFeed";

interface IWorkspaceRecentProps {
   workspaceId: string
}

export const WorkspaceRecent = ({ workspaceId }: IWorkspaceRecentProps) => {
   const { data } = useGetActivityQuery(workspaceId)

   return (
      <>
         <h2 className="text-xl font-medium">Последния действия</h2>
         {
            data && <ActivityFeed activities={data} />
         }
      </>
   );
};

import { useGetActivityQuery } from "../api/workspaceApi";
import { ActivityFeed } from "./WorkspaceActivityFeed";
import { useTranslation } from "react-i18next";

interface IWorkspaceRecentProps {
   workspaceId: string
}

export const WorkspaceRecent = ({ workspaceId }: IWorkspaceRecentProps) => {
   const { t } = useTranslation()
   const { data } = useGetActivityQuery(workspaceId)

   return (
      <>
         <h2 className="text-xl font-medium mb-5">{t("activity.recentTitle")}</h2>
         {
            data && <ActivityFeed activities={data} />
         }
      </>
   );
};

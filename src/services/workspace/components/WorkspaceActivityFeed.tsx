import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import type { IWorkspaceActivity } from "../types/workspace-activity";
import { WorkspaceActivityItem } from "./WorkspaceActivityItem";
import { formatActivityTime } from "@/shared/lib/formate-activity-time";
import { useTranslation } from "react-i18next";
import { getUserInitials } from "@/shared/utils/get-user-initials";

type Props = {
   activities: IWorkspaceActivity[];
};

export const ActivityFeed = ({ activities }: Props) => {
   const { t } = useTranslation();

   return (
      <div className="flex flex-col gap-3 min-h-[250px] rounded-lg as">
         {activities.length > 0 ? (
            activities.map((activity) => {
               switch (activity.type) {
                  case "TASK_CREATED": {
                     return (
                        <WorkspaceActivityItem
                           key={activity.id}
                           username={activity.user.fullName}
                           userAvatar={activity.user.avatar ?? ""}
                           activityLabel={t("activity.taskCreated")}
                           entityName={activity.metadata.taskName ?? ""}
                           time={formatActivityTime(activity.createdAt)}
                        />
                     );
                  }
                  case "TASK_MOVED":
                     return (
                        <div
                           key={activity.id}
                           className="flex justify-between items-center pl-2 py-4 border-b"
                        >
                           <div className="flex gap-2 items-center">
                              <Avatar>
                                 <AvatarImage
                                    src={activity.user.avatar ?? ""}
                                 />
                                 <AvatarFallback>
                                    {getUserInitials(activity.user.username)}
                                 </AvatarFallback>
                              </Avatar>
                              <div
                                 className="text-base flex gap-1 items-center whitespace-normal wrap-break-word
                                 max-lg:flex-wrap
                                 max-md:text-sm
                                 "
                              >
                                 <span className="font-semibold">
                                    {activity.user.fullName}
                                 </span>
                                 <span>{t("activity.taskMoved")}</span>
                                 <span className="font-semibold">
                                    {activity.metadata.taskName}
                                 </span>
                                 <span>{t("activity.toColumn")}</span>
                                 <span className="font-semibold">
                                    {activity.metadata.columnName}
                                 </span>
                              </div>
                           </div>
                           <div className="text-md text-muted-foreground italic max-md:text-sm">
                              {formatActivityTime(activity.createdAt)}
                           </div>
                        </div>
                     );
                  case "TASK_DELETED":
                     return (
                        <WorkspaceActivityItem
                           key={activity.id}
                           username={activity.user.fullName}
                           userAvatar={activity.user.avatar ?? ""}
                           activityLabel={t("activity.taskDeleted")}
                           entityName={activity.metadata.taskName ?? ""}
                           time={formatActivityTime(activity.createdAt)}
                        />
                     );

                  // case "COLUMN_CREATED":
                  //    return (
                  //       <div key={activity.id} className="text-sm" >
                  //          Создана колонка{" "}
                  //          <b> {activity.metadata.columnTitle} </b>
                  //       </div>
                  //    )

                  // case "USER_JOINED":
                  //    return (
                  //       <div key={activity.id} className="text-sm" >
                  //          <b>{activity.metadata.username} </b> вошёл в workspace
                  //       </div>
                  //    )

                  // case "USER_LEFT":
                  //    return (
                  //       <div key={activity.id} className="text-sm" >
                  //          <b>{activity.metadata.username} </b> покинул workspace
                  //       </div>
                  //    )

                  default:
                     return null;
               }
            })
         ) : (
            <div className="italic text-center py-10">{t("common.empty")}</div>
         )}
      </div>
   );
};

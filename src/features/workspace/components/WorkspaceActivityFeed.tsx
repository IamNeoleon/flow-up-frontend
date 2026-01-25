import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import type { IWorkspaceActivity } from "../types/workspace-activity"
import { WorkspaceActivityItem } from "./WorkspaceActivityItem";
import { formatActivityTime } from "@/shared/lib/formate-activity-time";

type Props = {
   activities: IWorkspaceActivity[]
}

export const ActivityFeed = ({ activities }: Props) => {

   return (
      <div className="flex flex-col gap-3" >
         {
            activities.map(activity => {
               switch (activity.type) {
                  case "TASK_CREATED": {
                     return (
                        <WorkspaceActivityItem
                           key={activity.id}
                           username={activity.user.username}
                           userAvatar={activity.user.avatar ?? ''}
                           activityLabel="Создал задачу"
                           entityName={activity.metadata.taskName ?? ''}
                           time={formatActivityTime(activity.createdAt)}
                        />
                     )
                  }
                  case "TASK_MOVED":
                     return (
                        <div key={activity.id} className="flex justify-between items-center pl-2 py-4 border-b">
                           <div className="flex gap-2 items-center">
                              <Avatar>
                                 <AvatarImage src={activity.user.avatar ?? ''} />
                                 <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div className="text-base flex gap-1 items-center">
                                 <span className="font-semibold">{activity.user.username}</span>
                                 <span>переместил задачу</span>
                                 <span className="font-semibold">{activity.metadata.taskName}</span>
                                 <span>в колонку</span>
                                 <span className="font-semibold">{activity.metadata.columnName}</span>
                              </div>
                           </div>
                           <div className="text-md text-muted-foreground italic">{formatActivityTime(activity.createdAt)}</div>
                        </div>
                     )
                  case "TASK_DELETED":
                     return (
                        <WorkspaceActivityItem
                           key={activity.id}
                           username={activity.user.username}
                           userAvatar={activity.user.avatar ?? ''}
                           activityLabel="Удалил задачу"
                           entityName={activity.metadata.taskName ?? ''}
                           time={formatActivityTime(activity.createdAt)}
                        />
                     )

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
                     return null
               }
            })}
      </div>
   )
}

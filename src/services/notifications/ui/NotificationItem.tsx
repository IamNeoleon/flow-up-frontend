import clsx from "clsx"
import { useMemo } from "react"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import { Check, Bell, ClockAlert, AtSign, UserPlus, UserMinus, RefreshCcw, AlarmClockOff } from "lucide-react"
import type { Notification } from "../types/notification"
import { Card, CardContent } from "@/shared/ui/shadcn/card"
import { Button } from "@/shared/ui/shadcn/button"
import { useMarkNotificationMutation } from "../api/notification-api"
import { formatNotificationDate } from "@/shared/lib/format-notification-date"
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/shared/ui/shadcn/tooltip"
import { routes } from "@/shared/routes"

interface IProps {
   notification: Notification
   onOpenTask?: (taskId: string) => void
}

type UiConfig = {
   icon: React.ReactNode
   title: string
   description?: string
}

export const NotificationItem = ({ notification, onOpenTask }: IProps) => {
   const { t } = useTranslation()

   const [markRead, { isLoading: isMarking }] = useMarkNotificationMutation()

   const isUnread = !notification.read

   const ui = useMemo<UiConfig>(() => {
      const taskName = notification.metadata?.taskName ?? t("common.untitled")


      switch (notification.type) {
         case "DEADLINE_SOON":
            return {
               icon: <ClockAlert size={20} />,
               title: t("notifications.notTitle.deadlineSoon"),
               description: t("notifications.notDesc.deadlineSoon", { taskName }),
            }

         case "DEADLINE_OVERDUE":
            return {
               icon: <AlarmClockOff size={20} />,
               title: t("notifications.notTitle.deadlineOverdue"),
               description: t("notifications.notDesc.deadlineOverdue", { taskName }),
            }

         case "STATUS_CHANGE":
            return {
               icon: <RefreshCcw size={20} />,
               title: t("notifications.notTitle.statusChanged"),
               description: t("notifications.notDesc.statusChanged", { taskName }),
            }

         case "ADD_ASSIGMENT":
            return {
               icon: <UserPlus size={20} />,
               title: t("notifications.notTitle.assigned"),
               description: t("notifications.notDesc.assigned", { taskName }),
            }

         case "REMOVE_ASSIGMENT":
            return {
               icon: <UserMinus size={20} />,
               title: t("notifications.notTitle.unassigned"),
               description: t("notifications.notDesc.unassigned", { taskName }),
            }

         case "COMMENT_MENTION":
            return {
               icon: <AtSign size={20} />,
               title: t("notifications.notTitle.commentMention"),
               description: t("notifications.notDesc.commentMention", { taskName }),
            }

         default:
            return {
               icon: <Bell size={20} />,
               title: t("notifications.notTitle.default"),
               description: "",
            }
      }
   }, [notification, t])

   const taskId = notification.metadata?.taskId

   const handleMarkRead = async () => {
      if (!isUnread) return

      try {
         await markRead({ id: notification.id }).unwrap()
      } catch (e) {
         console.error('Error', e)
      }
   }

   const handleOpen = async () => {
      await handleMarkRead()
      if (taskId) onOpenTask?.(taskId)
   }

   return (
      <Card className={clsx("transition-colors py-0", isUnread && "border-primary/40 bg-primary/5")}>
         <CardContent className="px-5 py-3">
            <div className="flex items-center gap-2">
               <h2 className="truncate text-base font-medium flex items-center gap-2">
                  <div className="shrink-0">{ui.icon}</div>
                  <span className="wrap-break-word whitespace-normal leading-5">{ui.title}</span>
               </h2>
               <div className="shrink-0 ml-auto flex items-center gap-2">
                  {isUnread && <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button onClick={handleMarkRead} disabled={!isUnread || isMarking} variant="ghost" size="icon">
                              <Check className="h-4 w-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent className="relative z-1000">
                           {t('notifications.markAsRead')}
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               </div>
            </div>
            <p className="line-clamp-2 text-sm">{ui.description}</p>
            <div className="mt-2 flex items-center justify-between">
               <span className="text-muted-foreground text-sm font-medium">{formatNotificationDate(notification.createdAt)}</span>

               {taskId && (
                  <Link to={routes.task({
                     workspaceId: notification.metadata.workspaceId,
                     boardId: notification.metadata.boardId,
                     colId: notification.metadata.colId,
                     taskId: notification.metadata.taskId
                  })}>
                     <Button variant='outline' size="sm" onClick={handleOpen}>
                        {t('common.open')}
                     </Button>
                  </Link>
               )}
            </div>
         </CardContent>
      </Card>
   )
}

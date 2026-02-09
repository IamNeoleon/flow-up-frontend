import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { PanelLeftClose, RotateCcw } from "lucide-react";

import { Spinner } from "@/shared/ui/shadcn/spinner";
import { Button } from "@/shared/ui/shadcn/button";
import { NotificationItem } from "./NotificationItem";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import type { Notification } from "../types/notification";

interface IProps {
   open: boolean;
   close: () => void;
   notifications: Notification[] | undefined,
   isLoading: boolean,
   isError: boolean,
   refetch: () => void
}

export const NotificationList = ({ open, close, notifications, isLoading, isError, refetch }: IProps) => {
   const { t } = useTranslation();

   const ref = useClickOutside<HTMLDivElement>(close);

   const isEmptyList =
      !isLoading &&
      !isError &&
      (notifications?.length ?? 0) === 0;

   const content = (() => {
      if (isLoading) {
         return <Spinner className="size-7" />;
      }

      if (isError) {
         return (
            <div className="text-center flex flex-col items-center gap-1">
               <span className="text-red-600 font-medium">
                  {t("notifications.error")}
               </span>
               <Button variant="ghost" onClick={() => refetch()} aria-label="Notifications">
                  <RotateCcw className="text-black dark:text-white" />
               </Button>
            </div>
         );
      }

      if ((notifications?.length ?? 0) === 0) {
         return <div className="font-medium italic">{t("notifications.empty")}</div>;
      }

      return notifications!.map((item) => (
         <NotificationItem
            key={item.id}
            notification={item}
            onOpenTask={(taskId) => console.log("open task", taskId)}
         />
      ));
   })();

   return (
      <div
         ref={ref}
         className={clsx(
            "fixed top-0 -left-full h-screen max-h-screen w-[350px] bg-background border z-50 transition-all duration-350 px-5 py-3 overflow-y-auto",
            "overscroll-contain scrollbar-gutter-stable",
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border",
            open && "left-(--sidebar-width)"
         )}
      >
         <div className="flex justify-between items-center mb-5">
            <span className="font-medium text-base">{t("notifications.title")}</span>
            <Button variant="ghost" onClick={close}>
               <PanelLeftClose className="text-black dark:text-white" />
            </Button>
         </div>

         <div className={clsx("flex flex-col gap-3 justify-center", isEmptyList && "h-full items-center")}>
            {content}
         </div>
      </div>
   );
};
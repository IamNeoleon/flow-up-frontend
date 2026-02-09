import { useWs } from "@/app/providers/WsProvider";
import { useEffect } from "react";
import { useAppDispatch } from "./redux";
import { notificationApi } from "@/services/notifications/api/notification-api";

export const useWsNotifications = () => {
   const { socket } = useWs()
   const dispatch = useAppDispatch()

   useEffect(() => {
      if (!socket) return

      socket.on('NOTIFICATION_NEW', () => {
         dispatch(notificationApi.util.invalidateTags([{ type: 'Notifications' }]))

         console.log('New notification')
      })

      return () => {
         socket.off('NOTIFICATION_NEW');
      };
   }, [socket])
}
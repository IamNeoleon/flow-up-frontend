import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const createSocket = (url: string, token: string) => {
   if (!socket) {
      socket = io(url, {
         auth: {
            token,
         },
      });
   }

   return socket;
}

export const disconnectSocket = () => {
   if (socket) {
      socket.disconnect();
      socket = null;
   }
}
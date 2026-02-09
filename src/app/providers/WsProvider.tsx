import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { selectToken, setToken, logout } from "@/store/slices/authSlice";
import { useRefreshMutation } from "@/services/auth/api/authApi"; // путь подстрой
import { getTokenFromLs } from "@/shared/lib/localStorage";

type WsStatus = "disconnected" | "connecting" | "connected";

type WsApi = {
   socket: Socket | null;
   status: WsStatus;
   joinWorkspace: (workspaceId: string) => void;
   leaveWorkspace: (workspaceId: string) => void;
   joinBoard: (boardId: string) => void;
   leaveBoard: (boardId: string) => void;
};

const WsContext = createContext<WsApi | null>(null);
const API_URL: string = import.meta.env.VITE_API_URL;

export function WsProvider({ children }: { children: React.ReactNode }) {
   const dispatch = useAppDispatch();
   const tokenFromState = useAppSelector(selectToken);
   const tokenFromLs = getTokenFromLs()
   const [socket, setSocket] = useState<Socket | null>(null);
   const [status, setStatus] = useState<WsStatus>("disconnected");

   const [refresh] = useRefreshMutation();
   const refreshingRef = useRef(false);

   useEffect(() => {
      let token: string = ''

      if (tokenFromState) {
         token = tokenFromState
      } else if (tokenFromLs) {
         token = tokenFromLs
      }

      if (!token) {
         socket?.disconnect();
         setSocket(null);
         setStatus("disconnected");
         return;
      }

      socket?.disconnect();
      setStatus("connecting");

      const s = io(`${API_URL}/ws`, {
         transports: ["websocket"],
         withCredentials: true,
         auth: { token },
         reconnection: true,
         reconnectionAttempts: 5,
         reconnectionDelay: 500,
         reconnectionDelayMax: 3000,
      });

      s.on("connect", () => setStatus("connected"));
      s.on("disconnect", () => setStatus("disconnected"));

      s.on("connect_error", async (err) => {
         setStatus("disconnected");

         const msg = String(err?.message || "").toLowerCase();
         const isAuthError = msg.includes("unauthorized") || msg.includes("invalid token");

         if (!isAuthError) return;

         if (refreshingRef.current) return;
         refreshingRef.current = true;

         try {
            const res = await refresh().unwrap();
            dispatch(setToken(res.accessToken));
         } catch (e) {
            dispatch(logout());
         } finally {
            refreshingRef.current = false;
         }
      });

      setSocket(s);

      return () => {
         s.disconnect();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [tokenFromState]);

   const joinWorkspace = (workspaceId: string) => socket?.emit("JOIN_WORKSPACE_ROOM", { workspaceId });
   const leaveWorkspace = (workspaceId: string) => socket?.emit("LEAVE_WORKSPACE_ROOM", { workspaceId });
   const joinBoard = (boardId: string) => socket?.emit("JOIN_BOARD_ROOM", { boardId });
   const leaveBoard = (boardId: string) => socket?.emit("LEAVE_BOARD_ROOM", { boardId });

   const api = useMemo<WsApi>(
      () => ({ socket, status, joinWorkspace, leaveWorkspace, joinBoard, leaveBoard }),
      [socket, status]
   );

   return <WsContext.Provider value={api}>{children}</WsContext.Provider>;
}

export function useWs() {
   const ctx = useContext(WsContext);
   if (!ctx) throw new Error("useWs must be used inside <WsProvider />");
   return ctx;
}
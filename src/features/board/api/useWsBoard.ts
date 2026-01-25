import { getTokenFromLs } from "@/shared/lib/localStorage"
import { createWsWrapper } from "@/shared/types/ws-wrapper"
import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"

export const useWsBoard = (boardId: string | undefined) => {
   const token = getTokenFromLs()

   const socketRef = useRef<Socket | null>(null)
   const wsRef = useRef<ReturnType<typeof createWsWrapper> | null>(null)

   useEffect(() => {
      if (!boardId) return

      const socket = io("http://localhost:3000", {
         auth: { token }
      })

      const ws = createWsWrapper(socket)

      socket.on("connect", () => {
         console.log("✅ WS CONNECTED", socket.id)
         ws.emit("JOIN_BOARD_ROOM", { boardId })
      })

      socket.on("disconnect", () =>
         console.log("❌ WS DISCONNECTED")
      )

      socketRef.current = socket
      wsRef.current = ws

      return () => {
         socket.disconnect()
      }
   }, [boardId, token])

   return {
      socket: socketRef.current,
      ws: wsRef.current
   }
}


import type { Socket } from "socket.io-client"
import type { IBoardEvents, BoardEventKey } from "@/shared/types/ws-events"

type AnySocket = Socket & {
   on(event: string, listener: (...args: any[]) => void): void
   off(event: string, listener?: (...args: any[]) => void): void
   emit(event: string, ...args: any[]): void
}

export const createWsWrapper = (socket: Socket) => {
   const s = socket as AnySocket

   return {
      on<K extends BoardEventKey>(
         event: K,
         cb: (payload: IBoardEvents[K]) => void
      ) {
         s.on(event, cb)
      },

      emit<K extends BoardEventKey>(
         event: K,
         payload: IBoardEvents[K]
      ) {
         s.emit(event, payload)
      },

      off<K extends BoardEventKey>(
         event: K,
         cb?: (payload: IBoardEvents[K]) => void
      ) {
         s.off(event, cb)
      },

      raw: socket
   }
}

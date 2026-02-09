import { useEffect, useRef } from "react"

export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
   const ref = useRef<T | null>(null)

   useEffect(() => {
      const handler = (e: PointerEvent) => {
         if (!ref.current) return
         if (!ref.current.contains(e.target as Node)) {
            onOutside()
         }
      }

      document.addEventListener("pointerdown", handler)
      return () => document.removeEventListener("pointerdown", handler)
   }, [onOutside])

   return ref
}
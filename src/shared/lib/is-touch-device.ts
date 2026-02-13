export const isTouchDevice = () =>
   typeof window !== "undefined" &&
   (navigator.maxTouchPoints > 0 ||
      window.matchMedia?.("(pointer: coarse)").matches);
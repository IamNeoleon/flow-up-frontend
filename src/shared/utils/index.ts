import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type SerializedError } from "@reduxjs/toolkit";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query"

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export const getErrorMessage = (
   err: FetchBaseQueryError | SerializedError | undefined
) => {
   if (!err) return "Unknown error";

   // RTK Query HTTP error
   if ("status" in err) {
      if (typeof err.data === "string") return err.data;

      if (err.data && typeof err.data === "object" && "message" in err.data) {
         return (err.data as { message?: string }).message || "Unknown error";
      }

      return `Error ${err.status}`;
   }

   // JS / SerializedError
   if ("message" in err && err.message) return err.message;

   return "Unknown error";
};

export const formatDate = (
   date: Date | string,
   locale: string = 'ru-RU'
) => {
   const d = typeof date === 'string' ? new Date(date) : date

   return d.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
   })
}

// const dateToApi = (date?: Date | null) => {
//    return date ? date.toISOString() : null
// }
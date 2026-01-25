import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

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
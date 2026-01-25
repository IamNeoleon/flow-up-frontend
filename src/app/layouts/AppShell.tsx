import { Suspense } from "react";
import { Outlet } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router";

export function AppShell() {
   const location = useLocation();

   return (
      <Suspense fallback={'Loading...'}>
         <AnimatePresence mode="wait" initial={false}>
            <motion.div
               key={location.pathname}
               className="w-full"
            >
               <Outlet />
            </motion.div>
         </AnimatePresence>
      </Suspense>
   );
}

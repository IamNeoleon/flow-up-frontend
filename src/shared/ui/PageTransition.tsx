import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Outlet } from "react-router";

export const PageTransition = () => {
   const location = useLocation();

   return (
      <AnimatePresence mode="wait" initial={false}>
         <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-full"
         >
            <Outlet />
         </motion.div>
      </AnimatePresence>
   );
}

import { Suspense } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "@/widgets/AppSidebar";
import { useWsNotifications } from "@/shared/hooks/useWsNotifications";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/shadcn/sidebar";

export const MainLayout = () => {
   useWsNotifications();

   return (
      <>
         <Suspense fallback={<div>Loading...</div>}>
            <SidebarProvider>
               <AppSidebar />
               <main className="flex-1 min-w-0 overflow-x-hidden">
                  <SidebarTrigger className="ml-2" />
                  <div className="py-6 px-16 max-xl:px-8 max-xl:py-2">
                     <Outlet />
                  </div>
               </main>
            </SidebarProvider>
         </Suspense>
      </>
   );
};

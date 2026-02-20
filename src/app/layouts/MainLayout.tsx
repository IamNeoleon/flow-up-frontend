import { Suspense } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "@/widgets/AppSidebar";
import { useWsNotifications } from "@/shared/hooks/useWsNotifications";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/shadcn/sidebar";
import { useNProgress } from "@/shared/hooks/use-n-progress";
import { NotVerifiedBlock } from "@/shared/ui/NotVefiriedBlock";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectAuth } from "@/store/slices/authSlice";

const PageLoader = () => {
   useNProgress(true);

   return null
};

export const MainLayout = () => {
   const { isEmailVerified } = useAppSelector(selectAuth)

   useWsNotifications();

   console.log(isEmailVerified);


   return (
      <>
         <Suspense fallback={<PageLoader />}>
            {!isEmailVerified && <NotVerifiedBlock />}
            <SidebarProvider>
               <AppSidebar />
               <main className="flex-1 min-w-0 overflow-x-hidden">
                  <SidebarTrigger className="ml-2" />
                  <div className="py-6 px-16 max-xl:px-8 max-xl:py-2 h-full">
                     <Outlet />
                  </div>
               </main>
            </SidebarProvider>
         </Suspense>
      </>
   );
};

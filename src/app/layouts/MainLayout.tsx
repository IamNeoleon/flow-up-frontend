import { Outlet, } from "react-router"
import { AppSidebar } from "@/widgets/AppSidebar"
import { Suspense } from "react";

export const MainLayout = () => {

   return (
      <>
         <Suspense fallback={null}>
            <div className="flex min-h-screen w-full">
               <AppSidebar />
               <main className="flex-1 py-6 px-16">
                  <Outlet />
               </main>
            </div>
         </Suspense>
      </>
   )
}
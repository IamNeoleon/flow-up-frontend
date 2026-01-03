import { Outlet } from "react-router"
import { AppSidebar } from "@/widgets/AppSidebar"

export const MainLayout = () => {
   return (
      <div className="flex min-h-screen w-full">
         <AppSidebar />
         <main className="flex-1 py-6 px-16">
            <Outlet />
         </main>
      </div>
   )
}

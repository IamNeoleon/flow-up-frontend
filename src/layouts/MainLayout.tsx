import { Outlet } from "react-router"
import { AppSidebar } from "@/widgets/AppSidebar"

export const MainLayout = () => {
   return (
      <div className="flex min-h-screen">
         <AppSidebar />
         <main className="flex-1 p-6">
            <Outlet />
         </main>
      </div>
   )
}

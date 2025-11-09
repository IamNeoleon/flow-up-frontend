import { Outlet } from "react-router"

export const MainLayout = () => {
   return (
      <div className="flex min-h-screen">
         <aside className="w-64 border-r p-4">Сайдбар</aside>
         <main className="flex-1 p-6">
            <Outlet />
         </main>
      </div>
   )
}

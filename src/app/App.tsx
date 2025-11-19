import { SidebarProvider } from "@/components/ui/sidebar"
import { AppRouter } from "./routes"

function App() {

  return (
    <>
      <SidebarProvider>
        <AppRouter />
      </SidebarProvider>
    </>
  )
}

export default App

import { SidebarProvider } from "@/components/ui/sidebar"
import { ModalProvider } from "./providers/ModalProvider"
import { AppRouter } from "./routes"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <ModalProvider>
        <SidebarProvider>
          <AppRouter />
          <Toaster theme="system" />
        </SidebarProvider>
      </ModalProvider>
    </>
  )
}

export default App

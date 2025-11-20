import { SidebarProvider } from "@/components/ui/sidebar"
import { ModalProvider } from "./providers/ModalProvider"
import { AppRouter } from "./routes"

function App() {

  return (
    <>
      <ModalProvider>
        <SidebarProvider>
          <AppRouter />
        </SidebarProvider>
      </ModalProvider>
    </>
  )
}

export default App

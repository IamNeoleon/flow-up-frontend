import { SidebarProvider } from "@/shared/ui/shadcn/sidebar"
import { ModalProvider } from "./providers/ModalProvider"
import { AppRouter } from "./routes"
import { Toaster } from "sonner"
import { ThemeProvider } from "./providers/ThemeProvider"

function App() {

  return (
    <>
      <ThemeProvider>
        <ModalProvider>
          <SidebarProvider>
            <AppRouter />
            <Toaster theme="system" />
          </SidebarProvider>
        </ModalProvider>
      </ThemeProvider>
    </>
  )
}

export default App

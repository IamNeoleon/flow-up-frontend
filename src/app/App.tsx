import { SidebarProvider } from "@/shared/ui/shadcn/sidebar"
import { ModalProvider } from "./providers/ModalProvider"
import { AppRouter } from "./routes"
import { Toaster } from "sonner"
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher"

function App() {

  return (
    <>
      <LanguageSwitcher />
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

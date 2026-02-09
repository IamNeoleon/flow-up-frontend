import { ModalProvider } from "./providers/ModalProvider"
import { AppRouter } from "./routes"
import { Toaster } from "sonner"
import { ThemeProvider } from "./providers/ThemeProvider"
import { WsProvider } from "./providers/WsProvider"

function App() {

  return (
    <>
      <WsProvider>
        <ThemeProvider>
          <ModalProvider>
            <AppRouter />
            <Toaster theme="system" />
          </ModalProvider>
        </ThemeProvider>
      </WsProvider>
    </>
  )
}

export default App

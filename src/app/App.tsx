import { ToastProvider } from "./providers/ToastProvider"
import { AppRouter } from "./routes"

function App() {

  return (
    <>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </>
  )
}

export default App

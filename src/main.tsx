import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './app/App.tsx'
import { store } from './store'
import { Provider } from 'react-redux'
import './config/i18n/i18n.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { simpleStore } from './store/simpleStore'
import './index.css'
import AppRouter from './routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={simpleStore}>
      <AppRouter />
    </Provider>
  </StrictMode>,
)

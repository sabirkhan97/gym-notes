import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryProvider } from './components/QueryProvider'
import { ThemeProvider } from './context/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <QueryProvider>
        <App />
      </QueryProvider>
    </ThemeProvider>

  </React.StrictMode>
)

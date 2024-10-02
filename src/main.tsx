import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ContainerProvider } from './Contexts/AppContext.tsx'
import App from './App.tsx'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Enlace de iconos de google*/}
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <ContainerProvider>
      <App />
    </ContainerProvider>
  </StrictMode>,
)

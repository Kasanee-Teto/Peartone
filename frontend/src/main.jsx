import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-brand-bg text-white font-body text-[15px] leading-[1.6] antialiased">
       <App />
    </div>
  </StrictMode>,
)

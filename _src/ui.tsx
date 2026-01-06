import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return <div>Hello NameKit</div>
}

createRoot(document.getElementById('root')!).render(<App />)

import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <App />
    </React.StrictMode>
)

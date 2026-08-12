import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/archivo/standard.css'
import '@fontsource-variable/source-serif-4/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/botao.css'

import { App } from './App'

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

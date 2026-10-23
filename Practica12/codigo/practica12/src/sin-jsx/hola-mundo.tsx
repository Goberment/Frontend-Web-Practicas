// Paso 3a: "Hola mundo" SIN JSX, solo con createElement.
// Para verlo: en index.html cambia el src del <script> a /src/sin-jsx/hola-mundo.tsx
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  createElement('h1', null, 'Hola mundo')
)

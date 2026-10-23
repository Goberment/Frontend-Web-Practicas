// Paso 3b: una tarjeta con tres elementos adentro, SIN JSX.
// Para verlo: en index.html cambia el src del <script> a /src/sin-jsx/tarjeta.tsx
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  createElement(
    'article',
    { className: 'tarjeta' },
    createElement('div', { className: 'tarjeta__avatar' }, 'JP'),
    createElement('h2', { className: 'tarjeta__nombre' }, 'Juan Pérez'),
    createElement('p', { className: 'tarjeta__carrera' }, 'Ingeniería en Sistemas')
  )
)

# Práctica 14

**Nombre:** Nicolas Becerra Muro
**ID:** 252101


## Ejercicio 1

### ¿Por qué en la pestaña Red salen dos peticiones al cargar?

Porque `main.jsx` renderiza la app dentro de `<StrictMode>`. En desarrollo, StrictMode monta cada componente, lo desmonta y lo vuelve a montar a propósito para comprobar que los efectos se limpian bien. Por eso el efecto de `useProductos` corre dos veces y se hacen dos peticiones `GET /productos`. En producción (`npm run build`) sólo sale una.

### ¿Qué pasa si quitas el arreglo de dependencias del efecto?

El efecto deja de depender de `[intento]` y corre después de cada render. Al terminar cada petición el hook guarda los productos, eso provoca otro render, que vuelve a correr el efecto, que vuelve a pedir los productos. Es un ciclo infinito: en la pestaña Red aparecen peticiones `GET /productos` sin parar.


## Ejercicio 2

### ¿Qué hace `e.preventDefault()` y qué pasa si lo quitas?

Cancela el comportamiento por defecto del evento. En un formulario, el comportamiento por defecto al enviarlo es que el navegador recargue la página. Con `e.preventDefault()` la página no se recarga y React puede validar los campos y mandar el pedido a la API. Si lo quito, al presionar «Pagar» la página se recarga y se pierde el estado: el carrito, los campos, los errores y el folio.


## Evidencias

Las capturas de pantalla están en la carpeta `evidencias/`.
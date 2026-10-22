Ejercicio 1: botón reutilizable
Cambiar la variante en el HTML sin tocar el TypeScript. Al cambiar variante="secundario"por variante="peligro"en index.html, el botón pasa de borde azul con fondo blanco a rojo, sin editar nada del TypeScript. El navegador vigila el atributo ( observedAttributes) y llama a attributeChangedCallback, que repinta la clase del <button>interno. Con deshabilitadoel botón se pone gris y deja de responder. El atributo se llama deshabilitado(no disabled), que es el que declara el componente.

¿Por qué el nombre de una etiqueta propia debe llevar guion? Porque el estándar reserva los nombres sin guion para las etiquetas actuales y futuras de HTML ( button, section, etc.). Un nombre con guion, como boton-app, nunca chocará con una etiqueta nueva del estándar. Además, customElements.definelanza un error si el nombre no lo lleva.

Ejercicio 2: tarjeta de producto
Atributos siempre llegan como texto getAttribute regresa siempre un string. Por eso precioy existenciase convierten con Number(...). Sin la conversión, existencia === 0no funcionaría con '0'y la tarjeta agotada no se detectaría.

Si el evento no puede salir del árbol de sombra, el contador no se mueve y no hay error El evento agregarse lanza con bubbles: truey composed: true. bubbleshace que suba por el árbol y composedpermite que cruce la frontera del Shadow DOM. Si se quita composed: true, el evento muere dentro de la sombra de la tarjeta: nunca llega a #rejilla, el oyente no se ejecuta y el contador no cambia. No hay error porque el evento sí se emitió; simplemente nadie fuera de la sombra lo recibe.

Un solo oyente para las doce tarjetas El evento sube hasta #rejilla, así que basta un addEventListener('agregar', ...)en el contenedor, en vez de uno por tarjeta. Las tarjetas agotadas no emiten nada.
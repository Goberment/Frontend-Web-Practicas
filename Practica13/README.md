## Respuestas
Ejercicio 1: 
¿Por qué el Layout no necesita saber que es una tienda?
Porque el Layout solo se encarga de acomodar lo que recibe: el encabezado, el pie de página y el contenido (children). No maneja productos, precios ni el carrito. Esa parte la resuelve App, que le pasa lo que debe mostrar. Por eso, el mismo Layout podría usarse para un blog o un panel de administración sin tener que cambiarlo.

Ejercicio 2: 
¿Qué pasa si escribes onClick={onAgregar(producto)} sin la flecha?
La función se ejecuta cuando se muestra la tarjeta, en lugar de esperar al clic. Esto pasa porque los paréntesis llaman a la función de inmediato. Entonces, onClick recibe el resultado de esa llamada, que en este caso es undefined, y el botón se queda sin una función que ejecutar.
Además, como onAgregar cambia el estado, React vuelve a mostrar el componente y ejecuta otra vez la función. Esto puede generar un ciclo infinito y provocar el error “Too many re-renders”. Para evitarlo, se pasa una función que espere al clic:
onClick={() => onAgregar(producto)}

Ejercicio 3:
¿Por qué con carrito.push(...) el contador no cambia y no aparece ningún error?
Porque push modifica directamente el arreglo que ya existe, pero no le avisa a React que debe actualizar la pantalla. Incluso si después se pasa ese mismo arreglo a setCarrito, React puede ignorar la actualización porque su referencia sigue siendo la misma.

No aparece un error porque modificar un arreglo con push es válido en JavaScript. Para actualizar correctamente el estado, se crea un arreglo nuevo:
setCarrito((anterior) => [...anterior, producto]);

Así React detecta el cambio y actualiza el contador.

Respuestas
Ejercicio 1: ¿por qué el Layout no necesita saber que es una tienda?

Porque el Layout solo recibe piezas ya hechas (encabezado, pie y children) y las acomoda en un orden. No importa productos, ni carrito, ni precios; no sabe qué hay dentro de cada hueco. Todo lo que tiene que ver con la tienda lo decide App, que es quien le pasa el contenido. Gracias a eso el mismo Layout serviría para un blog o un panel de administración sin cambiarle nada.

Ejercicio 2: ¿qué pasa si escribes onClick={onAgregar(producto)} sin la flecha?

La función se ejecuta en el momento de pintar la tarjeta, no cuando se hace clic, porque los paréntesis la invocan. A onClick se le asigna lo que esa llamada devuelve (undefined) y no una función, así que el botón ya no hace nada al presionarlo. Como onAgregar cambia el estado, ese cambio provoca otra pintada, que vuelve a ejecutar la función, y así se forma un ciclo infinito: React marca el error «Too many re-renders». Lo correcto es pasar una función: onClick={() => onAgregar(producto)}.

Ejercicio 3: ¿por qué con carrito.push(...) el contador no se mueve y no sale ningún error?

push modifica el arreglo que ya existe (lo muta), así que la referencia en memoria sigue siendo la misma. React decide si debe volver a pintar comparando por referencia: ve el mismo arreglo, concluye que el estado no cambió y no actualiza la pantalla. No sale error porque para JavaScript mutar un arreglo es totalmente válido; el problema es solo de cómo funciona React. Con setCarrito((anterior) => [...anterior, producto]) se crea un arreglo nuevo, la referencia cambia y el contador sí se actualiza.

Decisiones de diseño
Estado mínimo: solo se guardan categoria y carrito. La lista filtrada (visibles) y el total se derivan en cada pintada, así nunca quedan desfasados.
Sin mutar: el carrito siempre se reemplaza por un arreglo nuevo.
Filtros: las categorías se obtienen de los datos con new Set, así que si se agrega una categoría nueva el botón aparece solo.
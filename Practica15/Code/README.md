# Práctica 15

**Nombre:** Diego Francisco Montes Cruz
**ID:** 252812

---

## Ejercicio 1

### ¿Por qué el 404 sí tiene encabezado y pie?

Porque la ruta `*` es hija de la ruta de layout. Así el 404 se dibuja dentro del `<Outlet />` del `<Layout>`, que ya trae el encabezado y el pie.

### ¿Qué cambia en la pestaña Red si usas `<a href>` en lugar de `Link`?

Con `<a href>` la página se recarga completa: en Red aparece una fila `document` y se vuelven a descargar todos los archivos de JavaScript y CSS. Con `Link` no se recarga nada y solo aparece la petición a la API con los datos de la clase.

---

## Ejercicio 2

### ¿En qué tipo de dato llega el id de la URL y qué pasa si no lo conviertes?

Llega como `string` (`"1"`, no `1`). Si no lo convierto con `Number(id)`, TypeScript marca error porque `traerClase` espera un número, y las comparaciones con `===` contra ids numéricos fallan.

### ¿Qué pasa al ir de `/clases/1` a `/clases/2` si el id no está en las dependencias del efecto?

El efecto no se vuelve a ejecutar y no se pide la clase 2. La URL cambia a `/clases/2`, pero la pantalla sigue mostrando la clase 1.

---

## Evidencias

Las capturas de pantalla están en la carpeta `evidencias`.
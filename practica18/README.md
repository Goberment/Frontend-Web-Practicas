# Práctica 18

**Nombre:** Diego Francisco Montes Cruz
**ID:** 252812

## Medición del build

Antes (práctica 17, sin `lazy`):

| Archivo | Tamaño | gzip |
|---------|--------|------|
| `index-C1PoBtDw.js` (todo junto)    | 326.96 kB | 105.59 kB |
| `index-WW33TCtg.css`                | 6.43 kB | 1.96 kB |
| `index.html`                        | 0.46 kB | 0.29 kB |

Después (práctica 18, con `lazy`):

| Archivo | Tamaño | gzip |
|---------|--------|------|
| `index-HJYVHDIi.js` (principal)          | 322.86 kB | 105.29 kB |
| `PaginaClase-Dljn9bZJ.js`                | 2.44 kB | 1.12 kB |
| `PaginaRegistro-DGuoya5O.js`             | 1.52 kB | 0.63 kB |
| `PaginaClases-DpYb8wfN.js`               | 1.46 kB | 0.70 kB |
| `PaginaEntrar-BeTArkHn.js`               | 1.30 kB | 0.63 kB |
| `PaginaMisInscripciones-DSTSjnyS.js`     | 1.04 kB | 0.51 kB |
| `MensajeError-C8f2lYJn.js`               | 0.25 kB | 0.19 kB |
| `index-WW33TCtg.css`                     | 6.43 kB | 1.96 kB |
| `index.html`                             | 0.46 kB | 0.30 kB |

Con `lazy` el build pasó de 1 archivo JavaScript a 7. El archivo principal bajó de 326.96 kB a 322.86 kB. Al abrir `/clases` el navegador baja el principal, `PaginaClases` y `MensajeError` (324.57 kB); las demás páginas se bajan solo al visitarlas.

## Preguntas

### Ejercicio 1

**¿Cuánto se ahorró y por qué el ahorro es pequeño en esta aplicación?**

El archivo principal pasó de 326.96 kB a 322.86 kB: se ahorraron 4.10 kB (cerca del 1.3 %), y en gzip apenas 0.30 kB (de 105.59 a 105.29 kB). En la primera visita a `/clases` el ahorro es de unos 2.4 kB, porque se baja el principal más la página del catálogo (324.57 kB en total). El ahorro real de `lazy` es un poco mayor, unos 8 kB que corresponden al código de las páginas que salió del archivo principal, pero la práctica 18 también agregó Zustand y el store, que sumaron peso al archivo principal y compensan parte de la ganancia.

El ahorro es pequeño porque las páginas de esta aplicación son muy chicas: cada una pesa entre 1 y 2.5 kB, ya que son componentes con poco código. Casi todo el peso, unos 322 kB, viene de las librerías que se necesitan desde la primera pantalla (React, React DOM, React Router, Axios y Zustand), que se cargan sin importar la ruta. Partir por ruta solo mueve a archivos aparte el código propio de cada página, que es poco. En una aplicación grande, con páginas pesadas o con librerías que usa una sola ruta (gráficas, editores), el ahorro sería mucho mayor.

**¿Por qué falla la API si el preview corre en el puerto 4173?**

Por CORS. El backend solo permite peticiones cuyo origen sea `http://localhost:5173`. Cuando el preview corre en el puerto 4173, el origen es `http://localhost:4173`, que es distinto, porque el puerto forma parte del origen. El navegador bloquea la respuesta de la API porque no trae el encabezado `Access-Control-Allow-Origin` para ese origen, y en la consola aparece el error de CORS. Por eso el preview se sirve en el 5173.

### Ejercicio 2

**¿Cuándo conviene un contexto y cuándo un store?**

El contexto conviene para datos que cambian poco y que casi toda la app necesita, como la sesión: necesita un proveedor y, cuando el valor cambia, todos los componentes que lo usan se vuelven a renderizar. Un store como Zustand conviene para datos que cambian seguido y que se comparten entre muchas páginas, como las inscripciones: no necesita proveedor, vive fuera de React y cada componente se suscribe solo a la parte que lee (por ejemplo, el encabezado solo al total), así que solo se repinta cuando cambia esa parte.

## Evidencias

Carpeta `evidencias`

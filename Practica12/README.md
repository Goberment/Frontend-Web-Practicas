 Práctica 12 (parte 1): React, JSX y el primer proyecto con Vite

1. Ver qué hace el compilador con el JSX
Error al compilar sin configuración:
  × Expression expected
   ╭─[Hola.jsx:3:1]
 3 │     <h1 className="titulo">
   ·     ─
   ╰────
  × Expected ',', got 'ident'

Caused by:
    Syntax Error
Error: Failed to compile 1 file with swc.

El error aparece porque SWC no tiene habilitado el soporte para JSX en esa configuración. Al encontrar <h1>, intenta interpretarlo como JavaScript normal y no reconoce la sintaxis.

¿En qué se convirtió cada etiqueta del JSX?
- Modo clásico: cada etiqueta terminó como una llamada a React.createElement(tipo, props, ...hijos). Cuando una etiqueta está dentro de otra, también quedan llamadas anidadas.
- Modo automático: las etiquetas se transformaron en llamadas a _jsx(...) o _jsxs(...), importadas de react/jsx-runtime. _jsxs se utiliza cuando hay varios hijos, que se pasan mediante la propiedad children. Con este modo ya no necesitamos importar React solo para escribir JSX.
Si React es «solo una biblioteca», ¿quién traduce el JSX?

La traducción la hace una herramienta de compilación, como SWC o Babel. React proporciona las funciones que utiliza el código después de transformarse. En un proyecto con Vite, las herramientas configuradas junto con el plugin de React se encargan de que podamos escribir JSX y ejecutarlo en el navegador.
2. Crear el proyecto con Vite
En index.html está el contenedor donde se monta la aplicación:
<div id="root"></div>

El archivo src/main.tsx conecta React con ese contenedor. Ahí se utiliza createRoot(...).render(...) para mostrar la aplicación dentro de #root.
3. «Hola mundo» sin JSX
¿Qué hace createRoot y qué hace render?

createRoot crea una raíz de React vinculada a un elemento del DOM, en este caso #root. A partir de ahí, React administra el contenido de ese espacio.

Por su parte, render recibe los elementos o componentes que queremos mostrar y se encarga de iniciar su representación en la página.

Crear la tarjeta sin JSX sí funciona, pero requiere varias llamadas anidadas a createElement. Conforme agregamos elementos, cuesta más seguir la estructura y leer el código.
4. El primer componente
Error al quitar la prop obligatoria (<Saludo /> sin nombre):
Property 'nombre' is missing in type '{}' but required in type 'SaludoProps'. ts(2741)

TypeScript muestra este error porque SaludoProps define nombre como obligatorio. Para usar el componente correctamente, debemos pasar esa propiedad, por ejemplo:
<Saludo nombre="José" />

¿Por qué el nombre de un componente empieza con mayúscula?

Porque JSX distingue los componentes de las etiquetas HTML por la primera letra. Una etiqueta como <div> se transforma usando la cadena "div", mientras que <Saludo> hace referencia a la función o clase llamada Saludo.

Si escribimos <saludo>, JSX lo interpreta como una etiqueta y no como nuestro componente. Además, TypeScript normalmente lo señala porque esa etiqueta no está definida entre los elementos permitidos.
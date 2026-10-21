## Preguntas

1. ¿Por qué esta interfaz no menciona Express, NestJS ni memoria?
Porque MiembroRepository solo define qué operaciones se pueden hacer con los miembros, como listar, buscar, crear, actualizar y eliminar. No necesita saber qué herramienta se usa ni dónde se guardan los datos. Así, si después cambiamos de memoria a una base de datos, podemos mantener la misma estructura sin tener que modificar todo el sistema.
2. ¿Qué palabra de esa clase es la que promete cumplir la interfaz del paso anterior?
La palabra es implements. Al escribir MiembroMemoriaRepository implements MiembroRepository, indicamos que la clase debe cumplir con todos los métodos que pide la interfaz. Si falta alguno o está definido de otra manera, TypeScript nos señala el error.
4. ¿Por qué este archivo (el Service) no sabe qué es una petición HTTP?
Porque el Service se encarga de las operaciones con los miembros, no de cómo llegan las solicitudes. Recibe los datos, utiliza el repositorio y devuelve un resultado. El Controller es quien recibe las peticiones y responde con códigos como 201 o 404. Cada uno tiene su responsabilidad, lo que ayuda a mantener el código organizado.
5. ¿Por qué el Service se inyecta sin token en el Controller, y el repositorio sí necesita uno?
Porque el Service es una clase que NestJS puede reconocer cuando la aplicación está funcionando. En cambio, la interfaz del repositorio desaparece al compilar y NestJS necesita una forma de identificar qué implementación debe utilizar. Para eso sirve el token MIEMBRO_REPOSITORY: funciona como una etiqueta que conecta la interfaz con el repositorio correspondiente.
6. ¿Qué prueba, en los hechos, que agregar Miembros no rompió nada de Inscripciones?
La forma de comprobarlo es repetir las pruebas de Inscripciones después de agregar Miembros y revisar que sigan dando los resultados esperados: crear inscripciones, rechazar las duplicadas o cuando no hay cupo, cancelar una y volver a ocupar el lugar disponible.
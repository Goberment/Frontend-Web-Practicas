## Preguntas

 1. ¿Qué pasaría si el módulo no quedara registrado en la raíz?
Si el módulo no está conectado con AppModule, NestJS no toma en cuenta sus funciones ni sus rutas. Por eso, aunque el proyecto pueda compilar, al intentar entrar a /clases aparecería un error 404, porque esa ruta no estaría disponible. Crear el módulo no es suficiente; también hay que integrarlo a la aplicación.
2. ¿Por qué los métodos del repositorio devuelven promesas si los datos van a estar en memoria?
Porque eso permite preparar el sistema para usar una base de datos más adelante. Aunque ahora guardar o buscar información en memoria es rápido, una base de datos necesita tiempo para responder. Usar promesas desde el principio facilita ese cambio sin tener que modificar la forma en que el Service utiliza el repositorio.
3. ¿Qué error apareció al cambiar a la interfaz, y por qué la clase sí se había resuelto sola?
Apareció un error indicando que NestJS no podía encontrar el repositorio que necesitaba InscripcionesService.

Esto pasó porque NestJS puede reconocer una clase cuando la aplicación está funcionando, pero las interfaces desaparecen al compilar. Por eso, al usar la interfaz, hace falta un identificador o token que le indique qué repositorio debe utilizar.
4. ¿Por qué el servicio necesita un token para el repositorio, pero el controlador no lo necesita para el servicio?
Porque el Controller utiliza directamente la clase InscripcionesService, y NestJS puede identificarla. En cambio, el Service utiliza una interfaz para trabajar con el repositorio, y NestJS no puede reconocer esa interfaz durante la ejecución.

El token INSCRIPCION_REPOSITORY funciona como una etiqueta que le indica cuál es el repositorio que debe entregar al Service.
6. ¿Cuál es la diferencia entre un 400 y un 409?
- 400 Bad Request: hay un problema con los datos enviados, como un campo obligatorio que falta o un texto donde debería ir un número. Para resolverlo, hay que corregir la petición.
- 409 Conflict: los datos enviados están bien, pero existe una situación que impide completar la operación, como un horario lleno o una inscripción duplicada. Si esa situación cambia, la petición podría funcionar.
7. ¿Por qué cambió el código de estado de esa última petición?
Porque al cancelar la primera inscripción se liberó un lugar en el horario. Antes, la petición devolvía 409 porque el cupo estaba lleno. Después de la cancelación, se volvió a enviar la misma petición y respondió 201, porque ya había espacio para registrar al miembro.

Esto demuestra que el resultado también depende de la disponibilidad que tenga el sistema en ese momento.
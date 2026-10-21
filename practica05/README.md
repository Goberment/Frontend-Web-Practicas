1. ¿Qué generó el comando nest new?
Creó la carpeta gimnasio-api con la estructura básica de un proyecto NestJS. Incluyó los archivos principales, las carpetas para el código y las pruebas, y las configuraciones necesarias. También instaló las dependencias e inició el repositorio Git, dejando el proyecto listo para comenzar a trabajar.
2. ¿Qué hace el AppService que ya viene generado?
Tiene un método llamado getHello() que devuelve el mensaje "Hello World!". El AppController utiliza ese método para mostrar el mensaje al entrar a la ruta principal. Es un ejemplo sencillo de cómo se reparten las tareas: el Controller recibe la petición y el Service se encarga de la lógica.
3. ¿Por qué la ruta funciona sin declarar nada en app.module.ts?
Porque AppController ya está registrado en el módulo principal. Al agregar las rutas dentro de ese mismo Controller, NestJS las reconoce mediante las etiquetas @Get y @Post. Solo sería necesario modificar el módulo si agregáramos otro Controller o un servicio nuevo.
4. ¿Qué pasaría si el cuerpo de la petición viniera vacío?
Como todavía no hay validaciones, si enviamos {}, podría guardarse una clase sin nombre. Si el cuerpo llega como undefined, intentar leer su nombre provocaría un error y el servidor respondería con un 500.
Lo adecuado sería revisar los datos antes de guardarlos y responder con un 400 cuando falte información o sea incorrecta.
5. ¿En qué archivo vive hoy toda la lógica de la práctica?
Por ahora, todo está en src/app.controller.ts: tanto el arreglo que guarda las clases como las rutas para consultarlas y agregarlas. El archivo main.ts solo inicia la aplicación. Esta organización facilita empezar, aunque después conviene separar las responsabilidades para mantener el código más ordenado.

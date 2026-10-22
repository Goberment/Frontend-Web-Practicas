## Preguntas 
1. Express manda los rechazos de un handler async directo al middleware de errores. ¿Qué tendrían que agregar en cada ruta si esto no fuera así?
Tendrían que usar try/catchen cada ruta y llamar a next(error)para enviar el error al middleware.

2. ¿Por qué el servicio no lanza directamente un 409 en vez de EjemplarPrestadoError?
Porque el Servicio maneja reglas de negocio y no debe depender de HTTP. El middleware se encarga de convertir el error de negocio en un código HTTP como 409.

3. Si mañana agregaran una aplicación móvil que también consume esta API, ¿qué archivos de esta práctica tendrían que tocar?
Ninguno de la API. La aplicación móvil podría usar los mismos endpoints y contratos HTTP que ya existen.
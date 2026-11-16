# Práctica 17

**Nombre:** Diego Francisco Montes Cruz
**ID:** 252812

## Preguntas

### Ejercicio 1

**¿La ruta protegida hace segura la aplicación? ¿Qué es lo que de verdad protege los datos?**

No, la ruta protegida no hace que la aplicación sea completamente segura. Su función es evitar que una persona que no ha iniciado sesión pueda entrar a ciertas pantallas. Sin embargo, alguien podría modificar el frontend o intentar acceder directamente a la API usando herramientas como Postman o curl. La verdadera seguridad está en el backend, porque es el que revisa el token en cada petición y comprueba si el usuario tiene permiso para acceder a la información.

**Comprobación con curl:** `curl -i http://localhost:3000/inscripciones/mias` responde `401 Unauthorized`.

### Ejercicio 2

**¿Por qué no se manda el miembroId al inscribirse?**

Porque el backend ya puede identificar al usuario mediante su token JWT. Si enviáramos el miembroId desde el frontend, cualquier persona podría modificarlo e intentar inscribir a otro usuario. Por eso, es mejor que el backend obtenga ese dato directamente del token. Así se asegura de que la inscripción corresponda a la persona que inició sesión. El frontend únicamente necesita enviar el horarioId.


**¿Qué diferencia hay entre un 401 y un 403?**

El 401 (Unauthorized) significa que no se sabe quién eres: no mandaste token, está vencido o es falso. La solución es autenticarse de nuevo, por eso el interceptor cierra la sesión. El 403 (Forbidden) significa que sí se sabe quién eres, pero tu cuenta no tiene permiso para esa acción (por ejemplo, una cuenta que no es de un miembro intentando inscribirse). Volver a iniciar sesión no lo arregla, así que solo se muestra el mensaje de la API.




# Práctica 9 – Blindar la API

API del gimnasio (NestJS + Prisma 7 + MySQL 8). Esta práctica reemplaza los cuatro repositorios en memoria por repositorios de Prisma y blinda la API con tres piezas del ciclo de vida de una petición: **validación en la frontera** (`ValidationPipe` + DTO como clases), **traducción centralizada de errores** (filtro de excepciones) y **CORS**.

## Cómo ejecutarlo

```bash
npm install
# copiar .env.ejemplo a .env y poner la contraseña de MySQL
npx prisma migrate deploy      # aplica las migraciones de la Práctica 8
npx prisma generate            # genera el cliente en src/generado/
npm run start:dev
```

Los datos viven en MySQL y no se borran al reiniciar. Para empezar de cero: `npx prisma migrate reset`. Después, abrir `peticiones-practica09.http` (extensión **REST Client**), correr el bloque 0 (datos iniciales) una sola vez y seguir en orden.

## Qué cambió

| Pieza | Archivo | Cambio |
|---|---|---|
| Repositorios | `*.module.ts` (los 4) | `useClass` apunta al repositorio de Prisma; se borraron los 4 repositorios en memoria |
| DTO | `*/dto/*.dto.ts` | De interfaz a clase con decoradores de `class-validator` |
| Validación | `main.ts` | `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted`, `transform` y `forbidUnknownValues` |
| Errores | `inscripciones/dominio/errores.ts` | Nueva clase base `ErrorDominio`; los cuatro errores heredan de ella |
| Filtro | `comun/error-dominio.filter.ts` | `@Catch(ErrorDominio)`: 404 para lo que no existe, 409 para las reglas del gimnasio |
| Controlador | `inscripciones.controller.ts` | Se borró el `try/catch` y la validación manual |
| CORS | `main.ts` | Solo `http://localhost:5173` y `http://localhost:4200`; expone `Location` y `X-Request-Id` |

## Pruebas

Los resultados completos de una corrida real contra MySQL 8 están en `evidencias/resultados_pruebas_p9.txt`. Resumen:

| Prueba | Resultado |
|---|---|
| Inscripciones 1 y 2 al horario 1 | **201** + `Location` |
| Tercera inscripción (cupo de 2) | **409** cupo lleno |
| Miembro 1 repetido en el horario 1 | **409** duplicada |
| Horario o miembro inexistente | **404** |
| Cancelar y repetir la petición que había fallado | **200**, luego **201** |
| `{"horarioId":"hola"}` | **400** |
| Campo que no existe en el DTO | **400** `property admin should not exist` |

Cuerpo de un conflicto traducido por el filtro:

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "El horario 1 ya tiene 2 inscripciones confirmadas",
  "path": "/inscripciones",
  "timestamp": "2026-10-21T18:36:21.576Z"
}
```

---

## Respuestas

### 1. ¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?

**Ninguna.** Lo único que cambió fue el `useClass` en `clases.module.ts`, de `ClaseMemoriaRepository` a `ClasePrismaRepository`. El Service depende del token `CLASE_REPOSITORY` y de la interfaz `ClaseRepository`, no de una clase concreta, así que no se entera de qué hay detrás. Y el Controller solo conoce al Service.

### 2. ¿Por qué InscripcionesService no tuvo que cambiar ni una línea de las reglas de cupo y duplicados?

Porque las reglas solo usan los métodos de la interfaz `InscripcionRepository` (`buscarHorario`, `buscarMiembro`, `buscarPorHorario`, `guardar`) y los datos que devuelven, sin saber de dónde vienen. El repositorio de Prisma cumple el mismo contrato: mismas firmas, `null` cuando algo no existe y arreglos de inscripciones con `estado`. Además las reglas viven en el Service y no en el repositorio, que no valida nada. Se comprobó corriendo la misma batería de peticiones: los mismos códigos (201, 409, 409, 404, 404, 200, 201).

### 3. ¿Por qué una interfaz no puede validar nada en tiempo de ejecución?

Porque TypeScript borra las interfaces al compilar: en el JavaScript resultante no existen. `class-validator` funciona leyendo metadatos que los decoradores guardan en una **clase**, y una interfaz no puede llevar decoradores ni existe cuando el programa corre, así que no hay nada contra qué validar. Con una clase, el decorador queda registrado y el `ValidationPipe` lo consulta en cada petición.

### 4. ¿Qué código de estado responde y qué trae en el cuerpo?

Responde **400 Bad Request**. El cuerpo trae `message` con un arreglo de textos (uno por cada regla incumplida), `error` y `statusCode`. Con `{"horarioId":"hola"}`:

```json
{
  "message": ["horarioId must not be less than 1", "horarioId must be an integer number"],
  "error": "Bad Request",
  "statusCode": 400
}
```

Con un campo que el DTO no declara (`{"horarioId":1,"miembroId":1,"admin":true}`):

```json
{ "message": ["property admin should not exist"], "error": "Bad Request", "statusCode": 400 }
```

La opción indispensable es **`whitelist: true`**: lo comprobé quitándola y dejando `forbidNonWhitelisted: true`. La petición con el campo extra respondió **201** en lugar de 400, sin ninguna advertencia, porque `forbidNonWhitelisted` solo actúa sobre los campos que `whitelist` identifica como sobrantes.

### 5. ¿Cuántas líneas quedó más corto el controlador?

El controlador de Inscripciones pasó de **81 a 64 líneas (17 menos)** al borrar el bloque `try/catch` y los imports que quedaron sin uso (`ConflictException` y los cuatro errores de dominio). Si además se borra la validación manual del 400, que ahora hace el pipe, queda en **55 (26 menos en total)**. Los conflictos responden igual que antes (mismo código y mismo mensaje); el cuerpo ahora además trae `path` y `timestamp`.

### 6. Si la respuesta llega en los dos casos, ¿quién bloquea realmente y a quién protege?

Quien bloquea es **el navegador**, no el servidor. Con un origen no permitido (`http://sitio-malicioso.com`) el servidor respondió igual **200 con los datos**; lo único distinto es que **no incluyó** la cabecera `Access-Control-Allow-Origin`. Al no verla, el navegador se niega a entregar la respuesta al JavaScript de esa página. Esto protege **al usuario**: evita que una página ajena, abierta en su navegador, lea respuestas de la API usando lo que el navegador pueda enviar por él. **No protege al servidor**: `curl`, Postman o un script ignoran CORS, y hasta las peticiones simples se ejecutan en el servidor aunque el navegador no deje leer el resultado. Por eso CORS no sustituye a la validación ni a la autenticación.

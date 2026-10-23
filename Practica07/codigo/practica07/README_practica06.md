# Práctica 6 – Conectar el dominio con la API

API del gimnasio hecha con NestJS. Separa **Controller / Service / Module** y conecta el controlador con el dominio de inscripciones mediante **inyección de dependencias con token** para la interfaz del repositorio. Los errores de negocio se traducen a códigos HTTP en el controlador. No usa base de datos (repositorio en memoria).

## Cómo ejecutarlo

```bash
npm install
npm run start:dev
```

Abrir `peticiones.http` en VS Code (extensión **REST Client**) y ejecutar las peticiones **en orden**.

## Estructura

```
src/
├── clases/                  # Práctica 5, ahora separada en Module/Controller/Service
└── inscripciones/
    ├── dominio/             # entidades, errores, interfaz del repositorio
    ├── dto/
    ├── infra/               # repositorio en memoria
    ├── inscripciones.tokens.ts
    ├── inscripciones.service.ts     # reglas de negocio
    ├── inscripciones.controller.ts  # traducción de errores a HTTP
    └── inscripciones.module.ts      # { provide: TOKEN, useClass: ... }
```

## Resultados de las pruebas

| # | Petición | Resultado |
|---|----------|-----------|
| 1 | `POST /inscripciones` `{horarioId:1, miembroId:1}` | **201** + `Location: /inscripciones/1` |
| 2 | `POST /inscripciones` `{horarioId:1, miembroId:2}` | **201** + `Location: /inscripciones/2` |
| 3 | `POST /inscripciones` `{horarioId:1, miembroId:3}` | **409** – El horario 1 ya tiene 2 inscripciones confirmadas |
| 4 | `POST /inscripciones` `{horarioId:1, miembroId:1}` | **409** – El miembro 1 ya esta inscrito en el horario 1 |
| 5 | Horario 99 | **404** – No existe el horario 99 |
| 6 | Miembro 99 | **404** – No existe el miembro 99 |
| 7 | `{horarioId:"hola"}` | **400** – deben ser números enteros |
| 9 | `DELETE /inscripciones/1` | **200**, `estado: "cancelada"` |
| 10 | Misma petición de la #3 | **201** + `Location: /inscripciones/3` |

---

## Respuestas

### 1. ¿Qué pasaría si el módulo no quedara registrado en la raíz?

Nest arma el grafo de dependencias empezando por `AppModule` y siguiendo sus `imports`. Un módulo que nadie importa nunca se escanea: su servicio no se instancia y, sobre todo, **su controlador no registra ninguna ruta**. El proyecto compila sin errores, pero al pedir `GET /clases` responde `404 Cannot GET /clases` (lo comprobé quitando `ClasesModule` de `imports`). Generar el módulo con el CLI no basta si se crea a mano: hay que importarlo en la raíz.

### 2. ¿Por qué los métodos del repositorio devuelven promesas si los datos van a estar en memoria?

Porque la interfaz es un contrato pensado para el caso más lento. Hoy los datos viven en un arreglo, pero mañana la misma interfaz la implementará un repositorio con MySQL/Prisma, cuyo acceso es asíncrono. Si los métodos fueran síncronos, al cambiar de implementación habría que modificar la firma y todo el código que los llama (Service y Controller). Con `Promise` desde el inicio, el Service ya usa `await` y la sustitución no le afecta.

### 3. ¿Qué error apareció al cambiar a la interfaz, y por qué la clase sí se había resuelto sola?

Apareció:

```
Nest can't resolve dependencies of the InscripcionesService (?).
Please make sure that the argument at index [0] is available in the current module.
```

Con la **clase concreta**, TypeScript emite en tiempo de compilación el tipo del parámetro como metadato (`emitDecoratorMetadata`), y como una clase existe en runtime, Nest la usa como su propia llave de búsqueda en el contenedor. Con la **interfaz**, TypeScript la borra al compilar: el metadato queda como `Object` y Nest no tiene ninguna llave con la cual buscar el proveedor (de ahí el `?` en el mensaje).

### 4. ¿Por qué el servicio necesita un token para el repositorio, pero el controlador no lo necesita para el servicio?

Porque el controlador depende de una **clase** (`InscripcionesService`), que existe en runtime y funciona como su propio token. El servicio depende de una **interfaz** (`InscripcionRepository`), que desaparece al compilar y no puede servir de llave. Por eso se crea una constante (`INSCRIPCION_REPOSITORY`), se pide con `@Inject(INSCRIPCION_REPOSITORY)` y en el módulo se registra `{ provide: INSCRIPCION_REPOSITORY, useClass: InscripcionMemoriaRepository }`. La interfaz le sirve a TypeScript al compilar; el token le sirve a Nest en runtime.

### 6. ¿Cuál es la diferencia entre un 400 y un 409?

- **400 Bad Request:** el servidor **no entiende la petición** porque está mal formada (faltan campos o tienen un tipo incorrecto). Se detecta mirando solo el cuerpo, sin consultar el sistema. Reenviarla igual nunca funcionará.
- **409 Conflict:** la petición es **válida y se entiende**, pero choca con el **estado actual** del sistema (cupo lleno, inscripción duplicada). Puede funcionar más adelante si el estado cambia.

### 7. ¿Por qué cambió el código de estado de esa última petición?

La petición fue exactamente la misma (`{horarioId: 1, miembroId: 3}`), pero el **estado del sistema** cambió. Al cancelar la inscripción 1 su estado pasó a `cancelada`, y la regla del cupo solo cuenta las `confirmadas`, así que el horario pasó de 2/2 a 1/2 y quedó un lugar libre. Un 409 describe un conflicto con el estado actual, no un defecto de la petición; cuando ese estado cambia, el resultado cambia de **409 a 201**.

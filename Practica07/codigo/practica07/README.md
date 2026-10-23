# Práctica 7 – Construir el módulo Miembros

API del gimnasio con NestJS. Esta práctica repite, sobre una segunda entidad (**Miembro**), el patrón completo de **interfaz de repositorio + token de inyección** construido en la Práctica 6 con Inscripciones. El proyecto incluye ambos módulos. Las respuestas de la Práctica 6 están en `README_practica06.md`.

## Cómo ejecutarlo

```bash
npm install
npm run start:dev
```

- `peticiones-miembros.http`: las peticiones de Miembros (Práctica 7).
- `peticiones.http`: las peticiones de Inscripciones (Práctica 6).

Ambos se ejecutan con la extensión **REST Client** de VS Code, en orden. Todo vive en memoria: al reiniciar el servidor vuelve a cero.

## Estructura del módulo

```
src/miembros/
├── dominio/
│   ├── entidades.ts              # interfaz Miembro
│   └── miembro.repository.ts     # interfaz MiembroRepository
├── dto/
│   ├── crear-miembro.dto.ts
│   └── actualizar-miembro.dto.ts
├── infra/
│   └── miembro-memoria.repository.ts   # MiembroMemoriaRepository implements MiembroRepository
├── miembros.tokens.ts            # MIEMBRO_REPOSITORY
├── miembros.service.ts           # @Inject(MIEMBRO_REPOSITORY), solo delega
├── miembros.controller.ts        # 5 rutas sobre /miembros
└── miembros.module.ts            # { provide: MIEMBRO_REPOSITORY, useClass: ... }
```

Al levantar el servidor aparece `MiembrosController {/miembros}` con sus cinco rutas: `GET /miembros`, `GET /miembros/:id`, `POST /miembros`, `PATCH /miembros/:id` y `DELETE /miembros/:id`.

## Pruebas de Miembros

| # | Petición | Resultado |
|---|----------|-----------|
| 1 | `GET /miembros` | **200**, los 3 miembros iniciales |
| 2 | `GET /miembros/1` | **200**, Karla Duarte |
| 3 | `POST /miembros` | **201** + `Location: /miembros/4` |
| 4 | `PATCH /miembros/2` `{membresia:"premium", activo:false}` | **200**, solo cambian esos campos |
| 5 | `DELETE /miembros/4` | **204**, sin cuerpo |
| 6 | `GET /miembros/99` | **404** |
| 7 | `POST /miembros` sin `correo` ni `membresia` | **400** |

La carpeta `evidencias/` contiene las capturas y los resultados completos en texto (`resultados_miembros.txt` y `resultados_inscripciones_regresion.txt`).

---

## Respuestas

### 1. ¿Por qué esta interfaz no menciona Express, NestJS ni memoria?

Porque `MiembroRepository` es un **contrato del dominio**: dice *qué* se puede hacer con los miembros (listar, buscar, crear, actualizar, eliminar), no *cómo* ni *a través de qué*. Solo usa tipos del propio dominio (`Miembro` y los DTO). Si mencionara Express o NestJS, el dominio quedaría atado al framework web; si mencionara un arreglo o un `Map`, quedaría atado a la memoria. Al mantenerla limpia, la misma interfaz la puede implementar mañana un repositorio con Prisma/MySQL sin que el Service ni el Controller cambien. Es la misma idea que `InscripcionRepository` de la Práctica 6: igual que ella, todos sus métodos devuelven `Promise` y usan `null` (o `false`) cuando no se encuentra algo; la diferencia es que esta es un CRUD completo y aquella tenía consultas específicas del negocio de inscripciones.

### 2. ¿Qué palabra de esa clase es la que promete cumplir la interfaz del paso anterior?

**`implements`**. En `class MiembroMemoriaRepository implements MiembroRepository` la clase se compromete a tener todos los métodos de la interfaz con las firmas correctas. Si falta uno o su firma no coincide, TypeScript marca el error al compilar.

### 4. ¿Por qué este archivo (el Service) no sabe qué es una petición HTTP?

Porque no importa nada de Express ni de las partes HTTP de NestJS: no usa `@Get`, `@Body`, `Request`, `Response` ni lanza `HttpException`. Solo recibe datos del dominio, los delega al repositorio y devuelve datos del dominio (incluso `null` cuando algo no existe). Traducir eso a códigos HTTP (404, 400, 201) es trabajo del **Controller**. Gracias a esa separación, el Service se puede reutilizar desde otro tipo de entrada (un comando, una prueba unitaria, otro protocolo) sin cambios.

### 5. ¿Por qué el Service se inyecta sin token en el Controller, y el repositorio sí necesita uno?

Porque el Controller depende de una **clase** (`MiembrosService`), que existe en tiempo de ejecución y funciona como su propia llave en el contenedor de Nest. El Service depende de una **interfaz** (`MiembroRepository`), que TypeScript borra al compilar: no deja nada que Nest pueda usar para buscar el proveedor. Por eso se crea la constante `MIEMBRO_REPOSITORY`, se pide con `@Inject(MIEMBRO_REPOSITORY)` y el módulo la registra con `{ provide: MIEMBRO_REPOSITORY, useClass: MiembroMemoriaRepository }`.

### 6. ¿Qué prueba, en los hechos, que agregar Miembros no rompió nada de Inscripciones?

Que se volvió a ejecutar la **misma secuencia de peticiones de la Práctica 6** con `MiembrosModule` ya registrado, y las respuestas fueron idénticas: 201 con `Locationpn` en las dos primeras inscripciones, 409 por cupo lleno, 409 por duplicada, 404 para horario y miembro inexistentes, 400 para cuerpo mal formado, 200 al cancelar y 201 al repetir la petición que había fallado (comparé la salida contra la de la Práctica 6, ignorando solo las fechas `creadaEn`, y no hubo diferencias; el resultado está en `evidencias/resultados_inscripciones_regresion.txt`). Esto es posible porque los módulos están aislados: Miembros tiene sus propios archivos y su propio token (`MIEMBRO_REPOSITORY`, distinto de `INSCRIPCION_REPOSITORY`), y para integrarlo solo se agregó una línea en `app.module.ts`, sin editar ningún archivo de Inscripciones.

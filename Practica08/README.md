Respuestas
1. ¿Por qué el paquete del adaptador se llama adapter-mariadb si usamos MySQL?
Porque el paquete lleva el nombre del driver que envuelve, no el de la base de datos. Prisma 7 se conecta mediante un "driver adapter", una capa delgada sobre un driver de npm; el que usa para el protocolo de MySQL se llama mariadb, y MySQL y MariaDB hablan el mismo protocolo de red. Por eso @prisma/adapter-mariadb funciona como adaptador de MySQL, aunque la base sea MySQL 8.

2. ¿Editar schema.prisma cambió algo en la base de datos antes de migrar?
No. schema.prisma es solo un archivo de texto que declara cómo queremos que sea la base. La base de datos solo cambia cuando se ejecuta prisma migrate dev, que traduce la diferencia a un archivo .sql y lo ejecuta en MySQL. Si se edita el esquema y no se migra, ambos quedan desalineados (lo que Prisma después reporta como drift).

3. ¿La carpeta de migraciones es una foto del esquema o un historial?
Es un historial. Cada carpeta es un paso con fecha que se aplica en orden y que ya no se modifica. Al agregar descripcion, Prisma no reescribió la migración inicial: creó una segunda con solo el ALTER TABLE, por eso hay dos carpetas. La foto del estado actual es schema.prisma; migrations/ guarda cómo se llegó hasta ahí, lo que permite que una base atrasada se ponga al día aplicando solo lo que le falta.

4. ¿Por qué Horario.clase sí crea columna y Clase.horarios no?
Porque Horario.clase es el lado que lleva @relation(fields: [claseId], references: [id]), y ese es el que declara qué columna guarda la llave foránea. En una relación de uno a muchos la llave vive siempre en el lado "muchos": cada horario apunta a una clase, y eso cabe en una columna (claseId). Clase.horarios es solo la vista inversa para consultar desde el código, un campo virtual: en una sola columna no caben "muchos" ids.

6. ¿De dónde sale la relación de muchos a muchos entre Miembro y Horario, si nunca se declaró?
Sale de que Inscripcion tenga dos relaciones de uno a muchos: una hacia Horario y otra hacia Miembro. Una relación de muchos a muchos siempre es eso: dos relaciones de uno a muchos con una tabla en medio. Aquí la tabla intermedia (inscripciones) tiene datos propios (estado, creadaEn), por eso se modela como una entidad con nombre y no como una lista dentro de Miembro. La restricción única sobre (horarioId, miembroId) evita que un mismo miembro quede inscrito dos veces en el mismo horario.







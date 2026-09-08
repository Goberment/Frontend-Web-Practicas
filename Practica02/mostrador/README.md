1.-¿por qué una unión de valores y no una enumeración?
R=Porque solo necesitas tres palabras fijas: 'activo', 'devuelto', 'vencido'. Con una unión, TypeScript te obliga a usar exactamente esas tres opciones, si escribes mal una, marca error, pero por dentro sigue siendo un texto normal, simple y ligero. Un enum haría lo mismo pero con más complicación innecesaria para un caso tan sencillo.

2.-¿qué se gana con el tipo desconocido en lugar del que acepta todo?
R=any le dice a TypeScript "no revises nada, confía en mí" — y si te equivocas, el programa truena en pleno uso. unknown le dice "esto puede ser cualquier cosa, revisa antes de usarlo". Como los datos del catálogo vienen de un archivo externo "catalogo.json", no sabes de antemano si vienen bien formados. Con unknown, TypeScript te obliga a comprobar que sí es un libro válido antes de tratarlo como tal — así detectas los datos corruptos antes de que rompan algo.

¿por qué la fecha entra como parámetro?
R= Para no depender del reloj de la computadora dentro de cada función. Si hoy se generara sola dentro de cada función, sería imposible probar el programa con fechas específicas, por ejemplo, "simula que hoy es 1 de enero de 2026". Al pasarla como parámetro, puedes controlarla desde afuera y todas las funciones usan siempre la misma fecha, sin sorpresas.


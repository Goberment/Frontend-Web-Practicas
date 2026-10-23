import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PrestamoService } from './prestamo.service.js';
import { InMemoryPrestamoRepository } from '../infra/in-memory-prestamo.repository.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';

test('camino feliz: crea un prestamo cuando los ejemplares estan libres', async () => {
  const repositorio = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repositorio);

  const prestamo = await servicio.crear({
    libroId: 'LIB-0001',
    socioId: 'S-100',
    ejemplares: [1, 2],
  });

  assert.equal(prestamo.libroId, 'LIB-0001');
  assert.equal(prestamo.socioId, 'S-100');
  assert.deepEqual(prestamo.ejemplares, [1, 2]);
  assert.equal(prestamo.estado, 'activo');

  const guardados = await repositorio.findByLibro('LIB-0001');
  assert.equal(guardados.length, 1);
});

test('ejemplar duplicado: rechaza un ejemplar que ya esta prestado', async () => {
  const repositorio = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repositorio);

  await servicio.crear({
    libroId: 'LIB-0002',
    socioId: 'S-200',
    ejemplares: [7, 8],
  });

  await assert.rejects(
    () =>
      servicio.crear({
        libroId: 'LIB-0002',
        socioId: 'S-201',
        ejemplares: [8, 9],
      }),
    EjemplarPrestadoError,
  );
});

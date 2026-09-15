import { InMemoryPrestamoRepository } from '../src/infra/in-memory-prestamo.repository.js';
import { PrestamoService } from '../src/servicios/prestamos.service.js';
import { EjemplarPrestadoError } from '../src/errores/ejemplar-prestado.error.js';

async function pruebaCaminoFeliz(): Promise<void> {
  const repositorio = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repositorio);

  const prestamo = await servicio.crear({
    libroId: 'LIB-001',
    socioId: 'S-001',
    ejemplares: [1, 2],
  });

  if (
    prestamo.libroId !== 'LIB-001' ||
    prestamo.socioId !== 'S-001' ||
    prestamo.ejemplares.length !== 2 ||
    prestamo.estado !== 'activo'
  ) {
    throw new Error('La prueba de camino feliz fallo');
  }

  console.log('✓ Prueba camino feliz: correcta');
}

async function pruebaEjemplarDuplicado(): Promise<void> {
  const repositorio = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repositorio);

  await servicio.crear({
    libroId: 'LIB-001',
    socioId: 'S-001',
    ejemplares: [1],
  });

  try {
    await servicio.crear({
      libroId: 'LIB-001',
      socioId: 'S-002',
      ejemplares: [1],
    });

    throw new Error('La prueba fallo: se permitio prestar el ejemplar duplicado');
  } catch (error) {
    if (!(error instanceof EjemplarPrestadoError)) {
      throw error;
    }
  }

  console.log('✓ Prueba ejemplar duplicado: correcta');
}

async function main(): Promise<void> {
  await pruebaCaminoFeliz();
  await pruebaEjemplarDuplicado();

  console.log('\n✓ Todas las pruebas pasaron correctamente');
}

main().catch((error) => {
  console.error('✗ Una prueba fallo:', error);
});
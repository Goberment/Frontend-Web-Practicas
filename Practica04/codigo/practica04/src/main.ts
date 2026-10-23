import { InMemoryPrestamoRepository } from './infra/in-memory-prestamo.repository.js';
import { PrestamoService } from './servicios/prestamo.service.js';
import { aResponseDto } from './dto/prestamo-response.dto.js';
import { EjemplarPrestadoError } from './errores/ejemplar-prestado.error.js';

async function main(): Promise<void> {
  const repositorio = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repositorio);

  console.log('\n1) Prestamo nuevo');
  const p1 = await servicio.crear({
    libroId: 'LIB-0417',
    socioId: 'S-001',
    ejemplares: [14, 15],
  });
  console.log('   creado:', aResponseDto(p1));

  console.log('\n2) Mismo ejemplar otra vez (debe fallar)');
  try {
    await servicio.crear({
      libroId: 'LIB-0417',
      socioId: 'S-002',
      ejemplares: [15, 16],
    });
    console.log('   ERROR: no debio permitirlo');
  } catch (e) {
    if (e instanceof EjemplarPrestadoError) {
      console.log('   correcto, la regla funciono:', e.message);
    } else {
      throw e;
    }
  }

  console.log('\n3) Prestamos del libro LIB-0417');
  const lista = await servicio.listarPorLibro('LIB-0417');
  console.log('   total:', lista.length);
  for (const p of lista) {
    console.log('   -', aResponseDto(p));
  }

  console.log('\n4) El DTO no debe filtrar costoReposicion');
  const dto = aResponseDto(p1);
  console.log('   costoReposicion presente:', 'costoReposicion' in dto);
  console.log('   (debe decir false)');
}

main().catch((e) => {
  console.error('Fallo la ejecucion:', e);
  process.exit(1);
});

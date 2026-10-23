import type { PrestamoRepository } from '../dominio/prestamo.repository.js';
import type { Prestamo } from '../dominio/prestamo.entity.js';
import { nuevoFolio } from '../dominio/prestamo.entity.js';
import type { CrearPrestamoDto } from '../dto/crear-prestamo.dto.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';

export class PrestamoService {
  constructor(private readonly repositorio: PrestamoRepository) {}

  async crear(dto: CrearPrestamoDto): Promise<Prestamo> {
    const prestamosDelLibro = await this.repositorio.findByLibro(dto.libroId);

    const ejemplaresOcupados = prestamosDelLibro
      .filter((p) => p.estado !== 'devuelto')
      .flatMap((p) => p.ejemplares);

    for (const ejemplar of dto.ejemplares) {
      if (ejemplaresOcupados.includes(ejemplar)) {
        throw new EjemplarPrestadoError(ejemplar);
      }
    }

    const nuevoPrestamo: Prestamo = {
      folio: nuevoFolio(),
      creadoEn: new Date(),
      libroId: dto.libroId,
      ejemplares: dto.ejemplares,
      socioId: dto.socioId,
      estado: 'activo',
      costoReposicion: 0,
    };

    return this.repositorio.save(nuevoPrestamo);
  }

  async listarPorLibro(libroId: string): Promise<Prestamo[]> {
    return this.repositorio.findByLibro(libroId);
  }
}

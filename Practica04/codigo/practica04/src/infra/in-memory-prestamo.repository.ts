import type { PrestamoRepository } from '../dominio/prestamo.repository.js';
import type { Prestamo } from '../dominio/prestamo.entity.js';

export class InMemoryPrestamoRepository implements PrestamoRepository {
  private readonly datos = new Map<string, Prestamo>();

  async findById(folio: string): Promise<Prestamo | null> {
    return this.datos.get(folio) ?? null;
  }

  async findAll(): Promise<Prestamo[]> {
    return [...this.datos.values()];
  }

  async save(entidad: Prestamo): Promise<Prestamo> {
    this.datos.set(entidad.folio, entidad);
    return entidad;
  }

  async delete(folio: string): Promise<void> {
    this.datos.delete(folio);
  }

  async findByLibro(libroId: string): Promise<Prestamo[]> {
    return [...this.datos.values()].filter((p) => p.libroId === libroId);
  }
}

//  Vive en `infra/` porque es un DETALLE DE INFRAESTRUCTURA: es una de
//  las muchas formas posibles de guardar los datos. Manana puede ser
//  PostgreSQL con Prisma y nada mas arriba se enterara.
//
//  TODO: implementar la clase usando un Map<string, Prestamo>.
//    - findById   -> devolver el prestamo o null si no existe
//                    (pista: `this.datos.get(folio) ?? null`)
//    - findAll    -> `[...this.datos.values()]`
//    - save       -> guardar y devolver la entidad
//    - delete     -> borrar del Map
//    - findByLibro-> filtrar los que tengan ese libroId


import type { PrestamoRepository } from '../dominio/prestamo.repository.js';
import type { Prestamo } from '../dominio/prestamo.entity.js';

export class InMemoryPrestamoRepository implements PrestamoRepository {
  // El almacen: la llave es el folio, el valor es el prestamo completo.
  private readonly datos = new Map<string, Prestamo>();

  findById(folio: string): Promise<Prestamo | null> {
    return Promise.resolve(this.datos.get(folio) ?? null);
  }

  findAll(): Promise<Prestamo[]> {
    return Promise.resolve([...this.datos.values()]);
  }

  save(entidad: Prestamo): Promise<Prestamo> {
    this.datos.set(entidad.folio, entidad);
    return Promise.resolve(entidad);
  }

  delete(folio: string): Promise<void> {
    this.datos.delete(folio);
    return Promise.resolve();
  }

  findByLibro(libroId: string): Promise<Prestamo[]> {
    return Promise.resolve(
      [...this.datos.values()].filter(prestamo => prestamo.libroId === libroId)
    );
  }
}

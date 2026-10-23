import type { Miembro } from './entidades';
import type { CrearMiembroDto } from '../dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

// El contrato que el Service conoce. No menciona Express, NestJS ni
// memoria: solo dice QUE se puede hacer con los miembros, no COMO.
//
// Todos los metodos devuelven Promise, igual que InscripcionRepository:
// el contrato se disena para el caso mas lento (una base de datos).
export interface MiembroRepository {
  listar(): Promise<Miembro[]>;
  buscarPorId(id: number): Promise<Miembro | null>;
  crear(datos: CrearMiembroDto): Promise<Miembro>;
  actualizar(id: number, datos: ActualizarMiembroDto): Promise<Miembro | null>;
  eliminar(id: number): Promise<boolean>;
}

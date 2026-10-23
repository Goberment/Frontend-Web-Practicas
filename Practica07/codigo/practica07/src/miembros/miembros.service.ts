import { Inject, Injectable } from '@nestjs/common';
import type { MiembroRepository } from './dominio/miembro.repository';
import type { Miembro } from './dominio/entidades';
import type { CrearMiembroDto } from './dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from './dto/actualizar-miembro.dto';
import { MIEMBRO_REPOSITORY } from './miembros.tokens';

// Sin reglas de negocio propias: cada metodo solo delega al repositorio.
// Aqui no hay Request, Response ni codigos de estado.
@Injectable()
export class MiembrosService {
  constructor(
    @Inject(MIEMBRO_REPOSITORY)
    private readonly repo: MiembroRepository,
  ) {}

  listar(): Promise<Miembro[]> {
    return this.repo.listar();
  }

  buscar(id: number): Promise<Miembro | null> {
    return this.repo.buscarPorId(id);
  }

  crear(dto: CrearMiembroDto): Promise<Miembro> {
    return this.repo.crear(dto);
  }

  actualizar(id: number, dto: ActualizarMiembroDto): Promise<Miembro | null> {
    return this.repo.actualizar(id, dto);
  }

  eliminar(id: number): Promise<boolean> {
    return this.repo.eliminar(id);
  }
}

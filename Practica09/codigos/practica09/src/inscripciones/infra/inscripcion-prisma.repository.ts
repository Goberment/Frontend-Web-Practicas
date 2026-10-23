import { Injectable } from '@nestjs/common';
import { Inscripcion, NuevaInscripcion } from '../dominio/entidades';
import { InscripcionRepository } from '../dominio/inscripcion.repository';
import { PrismaService } from '../../prisma/prisma.service';

// Mismo contrato que InscripcionMemoriaRepository, contra MySQL. Es el
// mas interesante de los cuatro por tres razones:
//
//   1. `buscarHorario` y `buscarMiembro` ya NO leen del arreglo
//      gimnasio.seed.ts: leen de las tablas. Ese archivo deja de usarse.
//   2. Las Reglas 1 y 2 (no duplicar, no pasarse del cupo) siguen
//      viviendo en el Service, tal cual. El repositorio no valida nada.
//   3. El `as Promise<Inscripcion>` es porque Prisma genera su propio
//      tipo para el enum EstadoInscripcion, y el dominio lo declara
//      como union de strings ('confirmada' | 'cancelada'). Son el mismo
//      valor en tiempo de ejecucion, pero TypeScript no los da por
//      iguales.
@Injectable()
export class InscripcionPrismaRepository implements InscripcionRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany() as Promise<Inscripcion[]>;
  }

  buscarPorId(id: number): Promise<Inscripcion | null> {
    return this.prisma.inscripcion.findUnique({ where: { id } }) as Promise<Inscripcion | null>;
  }

  buscarPorHorario(horarioId: number): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany({ where: { horarioId } }) as Promise<Inscripcion[]>;
  }

  buscarHorario(horarioId: number) {
    return this.prisma.horario.findUnique({ where: { id: horarioId } });
  }

  buscarMiembro(miembroId: number) {
    return this.prisma.miembro.findUnique({ where: { id: miembroId } });
  }

  guardar(datos: NuevaInscripcion): Promise<Inscripcion> {
    return this.prisma.inscripcion.create({
      data: { horarioId: datos.horarioId, miembroId: datos.miembroId, estado: 'confirmada' },
    }) as Promise<Inscripcion>;
  }

  async cancelar(id: number): Promise<Inscripcion | null> {
    const existe = await this.prisma.inscripcion.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.inscripcion.update({
      where: { id },
      data: { estado: 'cancelada' },
    }) as Promise<Inscripcion>;
  }
}

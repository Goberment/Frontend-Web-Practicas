import { Injectable } from '@nestjs/common';
import { Horario } from '../dominio/entidades';
import { HorarioRepository } from '../dominio/horario.repository';
import { CrearHorarioDto } from '../dto/crear-horario.dto';
import { ActualizarHorarioDto } from '../dto/actualizar-horario.dto';
import { PrismaService } from '../../prisma/prisma.service';

// Mismo contrato que HorarioMemoriaRepository, contra MySQL.
//
// Novedad respecto a memoria: `claseId` ahora es una llave foranea de
// verdad. Crear un horario con una claseId que no existe ya no pasa
// -- MySQL lo rechaza (Prisma: P2003).
@Injectable()
export class HorarioPrismaRepository implements HorarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<Horario[]> {
    return this.prisma.horario.findMany();
  }

  buscarPorId(id: number): Promise<Horario | null> {
    return this.prisma.horario.findUnique({ where: { id } });
  }

  crear(datos: CrearHorarioDto): Promise<Horario> {
    return this.prisma.horario.create({ data: datos });
  }

  async actualizar(id: number, datos: ActualizarHorarioDto): Promise<Horario | null> {
    const existe = await this.prisma.horario.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.horario.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<Horario | null> {
    const existe = await this.prisma.horario.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.horario.delete({ where: { id } });
  }
}

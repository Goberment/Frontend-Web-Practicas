import { Injectable } from '@nestjs/common';
import { Miembro } from '../dominio/entidades';
import { MiembroRepository } from '../dominio/miembro.repository';
import { CrearMiembroDto } from '../dto/crear-miembro.dto';
import { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';
import { PrismaService } from '../../prisma/prisma.service';

// Mismo contrato que MiembroMemoriaRepository, contra MySQL.
//
// Novedad respecto a memoria: `correo` es @unique en la base. Repetir
// un correo ya NO se acepta -- MySQL lo rechaza (Prisma: P2002) y hoy
// eso sale como 500. Atraparlo y convertirlo en 409 es justo el tema
// de la Practica 9.
@Injectable()
export class MiembroPrismaRepository implements MiembroRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<Miembro[]> {
    return this.prisma.miembro.findMany();
  }

  buscarPorId(id: number): Promise<Miembro | null> {
    return this.prisma.miembro.findUnique({ where: { id } });
  }

  // `activo: true` lo ponia a mano el repositorio en memoria. Aqui ya
  // hay un @default(true) en el esquema, pero se deja explicito para
  // que las dos implementaciones se comporten igual.
  crear(datos: CrearMiembroDto): Promise<Miembro> {
    return this.prisma.miembro.create({ data: { ...datos, activo: true } });
  }

  async actualizar(id: number, datos: ActualizarMiembroDto): Promise<Miembro | null> {
    const existe = await this.prisma.miembro.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.miembro.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<Miembro | null> {
    const existe = await this.prisma.miembro.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.miembro.delete({ where: { id } });
  }
}

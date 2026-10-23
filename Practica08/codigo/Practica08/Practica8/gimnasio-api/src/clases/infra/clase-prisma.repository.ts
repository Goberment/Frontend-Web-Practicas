import { Injectable } from '@nestjs/common';
import { Clase } from '../dominio/entidades';
import { ClaseRepository } from '../dominio/clase.repository';
import { CrearClaseDto } from '../dto/crear-clase.dto';
import { ActualizarClaseDto } from '../dto/actualizar-clase.dto';
import { PrismaService } from '../../prisma/prisma.service';

// EL MISMO contrato que ClaseMemoriaRepository: implements
// ClaseRepository. Lo unico que cambia es el "detras": antes un
// arreglo, ahora MySQL a traves de Prisma.
//
// OJO: findMany() trae TODAS las columnas de la tabla, incluida
// `descripcion`, aunque la interfaz Clase del dominio solo declare
// { id, nombre }. TypeScript no recorta nada en tiempo de ejecucion,
// asi que ese campo de mas SI sale en el JSON.
@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<Clase[]> {
    return this.prisma.clase.findMany();
  }

  buscarPorId(id: number): Promise<Clase | null> {
    return this.prisma.clase.findUnique({ where: { id } });
  }

  crear(datos: CrearClaseDto): Promise<Clase> {
    return this.prisma.clase.create({ data: datos });
  }

  // El repositorio en memoria regresaba null cuando no existia; hay
  // que conservar ese contrato, porque update() de Prisma lanza
  // excepcion (P2025) en vez de regresar null.
  async actualizar(id: number, datos: ActualizarClaseDto): Promise<Clase | null> {
    const existe = await this.prisma.clase.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.clase.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<Clase | null> {
    const existe = await this.prisma.clase.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.clase.delete({ where: { id } });
  }
}

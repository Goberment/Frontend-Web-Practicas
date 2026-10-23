import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MiembrosService } from './miembros.service';
import type { CrearMiembroDto } from './dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from './dto/actualizar-miembro.dto';

@Controller('miembros')
export class MiembrosController {
  // El Service se inyecta SIN token: es una clase, existe en runtime y
  // es su propia llave. El token solo hace falta para la interfaz.
  constructor(private readonly servicio: MiembrosService) {}

  @Get()
  listar() {
    return this.servicio.listar();
  }

  @Get(':id')
  async buscar(@Param('id') id: string) {
    const miembro = await this.servicio.buscar(Number(id));
    if (!miembro) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
    return miembro;
  }

  @Post()
  @HttpCode(201)
  async crear(
    @Body() dto: CrearMiembroDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 400 = no entiendo la peticion (faltan campos o son de otro tipo).
    if (
      typeof dto?.nombre !== 'string' ||
      typeof dto?.correo !== 'string' ||
      typeof dto?.membresia !== 'string' ||
      !dto.nombre.trim() ||
      !dto.correo.trim() ||
      !dto.membresia.trim()
    ) {
      throw new BadRequestException(
        'nombre, correo y membresia son obligatorios y deben ser texto',
      );
    }
    const miembro = await this.servicio.crear(dto);
    res.setHeader('Location', `/miembros/${miembro.id}`);
    return miembro;
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarMiembroDto) {
    if (
      (dto?.nombre !== undefined && typeof dto.nombre !== 'string') ||
      (dto?.correo !== undefined && typeof dto.correo !== 'string') ||
      (dto?.membresia !== undefined && typeof dto.membresia !== 'string') ||
      (dto?.activo !== undefined && typeof dto.activo !== 'boolean')
    ) {
      throw new BadRequestException(
        'nombre, correo y membresia deben ser texto; activo debe ser booleano',
      );
    }
    const miembro = await this.servicio.actualizar(Number(id), dto ?? {});
    if (!miembro) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
    return miembro;
  }

  @Delete(':id')
  @HttpCode(204)
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.servicio.eliminar(Number(id));
    if (!eliminado) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
  }
}

import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { aInscripcionDto } from './dto/inscripcion-respuesta.dto';
import type { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import type { Response } from 'express';
import { CupoLlenoError, HorarioNoEncontradoError, InscripcionDuplicadaError, MiembroNoEncontradoError } from './dominio/errores';

@Controller('inscripciones')
export class InscripcionesController {
    constructor(private readonly servicio: InscripcionesService) {}

    @Get()
    async listar() {
        const lista = await this.servicio.listar();
        return lista.map(aInscripcionDto);
    }

    @Get(':id')
    async buscar(@Param('id') id: string) {
        const inscripcion = await this.servicio.buscar(Number(id));
        if (!inscripcion) {
            throw new NotFoundException(`No se encontró la inscripción con id ${id}`);
        }
        return aInscripcionDto(inscripcion);
    }

    @Post()
    @HttpCode(201)
    async crear(
        @Body() dto: CrearInscripcionDto,
        @Res({ passthrough: true }) res: Response) {
        
        if (!Number.isInteger(dto?.horarioId) || !Number.isInteger(dto?.miembroId)) {
            throw new BadRequestException('Los campos horarioId y miembroId deben ser números enteros');
        }

        try {
            const inscripcion = await this.servicio.crear(dto);
            res.setHeader('Location', `/inscripciones/${inscripcion.id}`);
            return aInscripcionDto(inscripcion);
        } catch (error) {
            if (error instanceof HorarioNoEncontradoError || error instanceof MiembroNoEncontradoError) {
                throw new NotFoundException(error.message);
            }
            if (error instanceof InscripcionDuplicadaError || error instanceof CupoLlenoError) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Delete(':id')
    async cancelar(@Param('id') id: string) {
        const cancelada = await this.servicio.cancelar(Number(id));
        if (!cancelada) {
            throw new NotFoundException(`No se encontró la inscripción con id ${id}`);
        }
        return aInscripcionDto(cancelada);
    }
}

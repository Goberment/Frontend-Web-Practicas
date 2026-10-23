import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';
import {
  CupoLlenoError,
  ErrorDominio,
  HorarioNoEncontradoError,
  InscripcionDuplicadaError,
  MiembroNoEncontradoError,
} from '../inscripciones/dominio/errores';

// Atrapa la CLASE BASE: cualquier error que herede de ErrorDominio
// llega aqui. El Service sigue lanzando errores de negocio puros (sin
// saber nada de HTTP) y esta es la UNICA pieza que los traduce.
@Catch(ErrorDominio)
export class ErrorDominioFilter implements ExceptionFilter {
  catch(error: ErrorDominio, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = this.estadoPara(error);

    // Siempre la misma estructura.
    res.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: error.message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }

  private estadoPara(error: ErrorDominio): number {
    // Algo que no existe -> 404
    if (error instanceof HorarioNoEncontradoError || error instanceof MiembroNoEncontradoError) {
      return HttpStatus.NOT_FOUND;
    }
    // Choca con las reglas del gimnasio -> 409
    if (error instanceof CupoLlenoError || error instanceof InscripcionDuplicadaError) {
      return HttpStatus.CONFLICT;
    }
    // Un error de dominio nuevo que todavia no se traduce.
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

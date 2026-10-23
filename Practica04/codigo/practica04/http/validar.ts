import type { ErrorRequestHandler } from 'express';

import type { CrearPrestamoRequestDto, ErrorResponseDto } from '../contratos/prestamo.dto.js';
import { EjemplarPrestadoError } from '../src/errores/ejemplar-prestado.error.js';

export class ErrorDeValidacion extends Error {
  constructor(public readonly detalles: string[]) {
    super('La peticion no cumple el contrato');
    this.name = 'ErrorDeValidacion';
  }
}

export function validarCrearPrestamo(datos: unknown): CrearPrestamoRequestDto {
  const detalles: string[] = [];

  if (typeof datos !== 'object' || datos === null) {
    throw new ErrorDeValidacion(['El cuerpo debe ser un objeto JSON']);
  }

  const cuerpo = datos as Record<string, unknown>;

  if (typeof cuerpo.libroId !== 'string' || cuerpo.libroId.trim() === '') {
    detalles.push('libroId debe ser un texto no vacio');
  }

  if (typeof cuerpo.socioId !== 'string' || cuerpo.socioId.trim() === '') {
    detalles.push('socioId debe ser un texto no vacio');
  }

  if (
    !Array.isArray(cuerpo.ejemplares) ||
    cuerpo.ejemplares.length === 0 ||
    !cuerpo.ejemplares.every((n) => typeof n === 'number' && Number.isInteger(n))
  ) {
    detalles.push('ejemplares debe ser una lista de numeros enteros con al menos un elemento');
  }

  if (detalles.length > 0) {
    throw new ErrorDeValidacion(detalles);
  }

  return {
    libroId: cuerpo.libroId as string,
    socioId: cuerpo.socioId as string,
    ejemplares: cuerpo.ejemplares as number[],
  };
}

export const middlewareErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ErrorDeValidacion) {
    const cuerpo: ErrorResponseDto = { error: err.message, detalles: err.detalles };
    res.status(400).json(cuerpo);
    return;
  }

  if (err instanceof EjemplarPrestadoError) {
    const cuerpo: ErrorResponseDto = { error: err.message };
    res.status(409).json(cuerpo);
    return;
  }

  console.error(err);
  const cuerpo: ErrorResponseDto = { error: 'Error interno del servidor' };
  res.status(500).json(cuerpo);
};

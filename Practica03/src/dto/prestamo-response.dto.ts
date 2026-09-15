//  Este es lo que el sistema DEVUELVE. Fijense en lo que NO lleva:
//  `costoReposicion` se queda dentro. Ese es el punto del patron.
//
//  TODO:
//    1. Declarar PrestamoResponseDto con: folio, libroId, ejemplares,
//       socioId, estado y creadoEn como string (formato ISO).
//    2. Escribir la funcion `aResponseDto(p: Prestamo)` que convierte
//       la entidad en el DTO.


import type { Prestamo } from '../dominio/prestamo.entity.js';
import type { PrestamoResponseDto } from '../../contratos/prestamo.dto.js';

export type { PrestamoResponseDto };

export function aResponseDto(p: Prestamo): PrestamoResponseDto {
  // TODO 3b.2: construir y devolver el DTO
  return {
    folio: p.folio,
    libroId: p.libroId,
    ejemplares: p.ejemplares,
    socioId: p.socioId,
    estado: p.estado,
    creadoEn: p.creadoEn.toISOString(),
  };
}

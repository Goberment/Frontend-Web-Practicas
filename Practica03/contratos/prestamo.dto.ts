// =====================================================================
//  contratos/prestamo.dto.ts   —   EL CONTRATO COMPARTIDO
// =====================================================================
//  Este archivo vive FUERA de src/ y de publico/ a proposito: es el
//  unico lugar que conocen las dos puntas del cable (backend y
//  frontend). Solo contiene tipos, nunca logica ni valores en tiempo
//  de ejecucion, por eso el cliente lo importa con `import type` y
//  desaparece por completo al compilar a JS de navegador.
// =====================================================================

export type EstadoPrestamo = 'activo' | 'devuelto' | 'vencido' | 'extraviado';

/** Lo que el backend devuelve al consultar o crear un prestamo. */
export interface PrestamoResponseDto {
  folio: string;
  libroId: string;
  ejemplares: number[];
  socioId: string;
  estado: EstadoPrestamo;
  creadoEn: string; // ISO
}

/** Lo que el cliente manda al crear un prestamo (POST /api/prestamos). */
export interface CrearPrestamoRequestDto {
  libroId: string;
  socioId: string;
  ejemplares: number[];
}

/** Forma uniforme de los errores que la API puede devolver. */
export interface ErrorResponseDto {
  error: string;
  detalle?: string;
}

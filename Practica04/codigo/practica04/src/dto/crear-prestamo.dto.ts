import type { Prestamo } from '../dominio/prestamo.entity.js';

export type CrearPrestamoDto = Omit<
  Prestamo,
  'folio' | 'creadoEn' | 'estado' | 'costoReposicion'
>;

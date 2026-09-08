export interface Libro {
    readonly id: string;
    readonly titulo: string;
    readonly autor: string;
    readonly anio?: number;
    readonly ejemplares: number;
}

export type EstadoPrestamo = 'activo' | 'devuelto' | 'vencido';

export interface Prestamo {
    readonly folio: string;
    readonly libroId: string;
    readonly socio: string;
    readonly venceEn: Date;
    devueltoEn?: Date;
}

export class LibroNoEncontradoError extends Error {};
export class SinEjemplaresError extends Error {};
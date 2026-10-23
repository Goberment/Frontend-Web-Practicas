export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  existencia: number;
}

export interface DetalleAgregar {
  id: string;
  nombre: string;
  precio: number;
}

declare global {
  interface HTMLElementEventMap {
    agregar: CustomEvent<DetalleAgregar>;
  }
}

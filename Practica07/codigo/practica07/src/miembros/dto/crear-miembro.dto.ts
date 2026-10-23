// Lo que SI manda el cliente. No incluye id (lo asigna el repositorio)
// ni activo (un miembro nuevo siempre nace activo).
export interface CrearMiembroDto {
  nombre: string;
  correo: string;
  membresia: string;
}

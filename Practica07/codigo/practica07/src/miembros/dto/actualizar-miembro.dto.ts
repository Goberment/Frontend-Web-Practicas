// Los mismos campos, todos opcionales (se cambia solo lo que se manda),
// mas activo, que solo tiene sentido al actualizar.
export interface ActualizarMiembroDto {
  nombre?: string;
  correo?: string;
  membresia?: string;
  activo?: boolean;
}

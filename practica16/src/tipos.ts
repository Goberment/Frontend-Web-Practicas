export type Categoria = 'fuerza' | 'cardio' | 'flexibilidad';

export interface Clase {
  id: number;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  duracionMin: number;
  imagen: string;
}

export interface Horario {
  id: number;
  dia: string;
  horaInicio: string;
  entrenador: string;
  cupoMaximo: number;
  disponibles: number; 
}

export interface ClaseConHorarios extends Clase {
  horarios: Horario[];
}

export interface Usuario {
  correo: string;
  nombre: string;
  rol: 'miembro' | 'entrenador' | 'admin';
}

export interface Sesion {
  token: string;
  usuario: Usuario;
}

export interface Inscripcion {
  id: number;
  estado: 'confirmada' | 'cancelada';
  creadaEn: string;
  horario: { id: number; dia: string; horaInicio: string; entrenador: string };
  clase: { id: number; nombre: string; imagen: string };
}

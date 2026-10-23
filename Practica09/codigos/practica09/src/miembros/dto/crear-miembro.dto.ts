import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Los unicos valores que acepta la API. Se exporta para reutilizarlo.
export const MEMBRESIAS = ['basica', 'plus', 'premium'] as const;

export class CrearMiembroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsEmail()
  @MaxLength(160)
  correo!: string;

  @IsIn(MEMBRESIAS)
  membresia!: string;
}

import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MEMBRESIAS } from './crear-miembro.dto';

// Todo opcional: un PATCH manda solo lo que cambia. "activo" es el
// campo pensado para dar de baja a un miembro sin borrar su historial.
export class ActualizarMiembroDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  correo?: string;

  @IsOptional()
  @IsIn(MEMBRESIAS)
  membresia?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

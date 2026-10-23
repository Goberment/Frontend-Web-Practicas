import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// Todo opcional: un PATCH manda solo lo que cambia.
export class ActualizarHorarioDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  claseId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dia?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe tener formato HH:MM (24 horas)' })
  horaInicio?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  entrenador?: string;
}

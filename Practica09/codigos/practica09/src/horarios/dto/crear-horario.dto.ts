import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  @Min(1)
  claseId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dia!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe tener formato HH:MM (24 horas)' })
  horaInicio!: string;

  @IsInt()
  @Min(1)
  cupoMaximo!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  entrenador!: string;
}

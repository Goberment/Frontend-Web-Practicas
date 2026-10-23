import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Todo opcional: un PATCH manda solo lo que cambia.
export class ActualizarClaseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre?: string;
}

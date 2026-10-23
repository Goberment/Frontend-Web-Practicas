import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Una CLASE (no una interfaz): las interfaces desaparecen al compilar
// y class-validator necesita los decoradores en tiempo de ejecucion.
export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre!: string;
}

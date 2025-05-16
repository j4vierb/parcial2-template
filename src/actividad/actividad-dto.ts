import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActividadDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  fecha: string;

  @IsNotEmpty()
  @IsNumber()
  cupoMaximo: number;

  @IsNotEmpty()
  @IsNumber()
  estado: number;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReseñaDto {
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsNotEmpty()
  @IsNumber()
  calificacion: number;
}

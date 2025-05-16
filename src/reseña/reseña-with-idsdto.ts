import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReseñaWithIdsdto {
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsNotEmpty()
  @IsNumber()
  calificacion: number;

  @IsNumber()
  @IsNotEmpty()
  idEstudiante: number;
}

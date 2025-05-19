import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReseñaWithIdsdto {
  @IsString()
  @IsNotEmpty()
  readonly comentario: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsNotEmpty()
  @IsNumber()
  readonly calificacion: number;

  @IsNumber()
  @IsNotEmpty()
  readonly idEstudiante: number;

  @IsNumber()
  @IsNotEmpty()
  readonly idActividad: number;
}

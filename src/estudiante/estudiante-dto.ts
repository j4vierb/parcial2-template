import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EstudianteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  programa: string;

  @IsNumber()
  @IsNotEmpty()
  cedula: string;

  @IsNumber()
  @IsNotEmpty()
  semestre: string;
}

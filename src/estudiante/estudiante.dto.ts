import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EstudianteDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsNumber()
  readonly cedula: number;

  @IsNotEmpty()
  @IsString()
  readonly correo: string;

  @IsNotEmpty()
  @IsString()
  readonly programa: string;

  @IsNotEmpty()
  @IsNumber()
  readonly semestre: number;
}

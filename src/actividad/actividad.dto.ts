import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActividadDto {
  @IsNotEmpty()
  @IsString()
  readonly titulo: string;

  @IsNotEmpty()
  @IsString()
  readonly fecha: string;

  @IsNotEmpty()
  @IsNumber()
  readonly cupoMaximo: number;

  @IsNotEmpty()
  @IsNumber()
  readonly estado: number;
}

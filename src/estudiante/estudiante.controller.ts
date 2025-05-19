import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { EstudianteDto } from './estudiante-dto';
import { plainToInstance } from 'class-transformer';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(
    @Body() estudiante: EstudianteDto,
  ): Promise<EstudianteEntity> {
    const estudianteEntity = plainToInstance(EstudianteEntity, estudiante);
    return this.estudianteService.crearEstudiante(estudianteEntity);
  }

  @Post('/:estudianteId/')
  async inscribirEstudiante(
    @Param('estudianteId') estudianteId: number,
    @Body('actividadId') actividadId: number,
  ): Promise<EstudianteEntity> {
    return await this.estudianteService.inscribirseActividad(
      estudianteId,
      actividadId,
    );
  }

  @Get(':estudianteId')
  async findEstudianteById(@Param('estudianteId') estudianteId: number) {
    return await this.estudianteService.findEstudianteById(estudianteId);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActividadEntity } from './actividad.entity';
import { ActividadDto } from './actividad-dto';
import { plainToInstance } from 'class-transformer';

@Controller('actividades')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crearActividad(
    @Body() actividad: ActividadDto,
  ): Promise<ActividadEntity> {
    const actividadEntity = plainToInstance(ActividadEntity, actividad);
    return this.actividadService.crearActividad(actividadEntity);
  }

  @Put(':actividadId/')
  async cambiarEstado(
    @Param('actividadId') actividadId: number,
    @Body('estado') estado: number,
  ) {
    return this.actividadService.cambiarEstado(actividadId, estado);
  }

  @Get('/:fechaId')
  async findAllActividadesByDate(
    @Param('fechaId') fechaId: string,
  ): Promise<ActividadEntity[]> {
    return this.actividadService.findAllActividadesByDate(fechaId);
  }
}

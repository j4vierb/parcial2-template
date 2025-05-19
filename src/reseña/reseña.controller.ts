import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReseñaService } from './reseña.service';
import { ReseñaEntity } from './reseña.entity';
import { ReseñaWithIdsdto } from './reseña-with-idsdto';
import { plainToInstance } from 'class-transformer';

@Controller('resenias')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService) {}

  @Post()
  async agregarReseña(
    @Body() reseñaWithIds: ReseñaWithIdsdto,
  ): Promise<ReseñaEntity> {
    const { idActividad, idEstudiante } = reseñaWithIds;
    const reseñaEntity: ReseñaEntity = plainToInstance(
      ReseñaEntity,
      reseñaWithIds,
    );
    return await this.reseñaService.agregarReseña(
      reseñaEntity,
      idEstudiante,
      idActividad,
    );
  }

  @Get('/:reseñaId')
  async findReseñaById(
    @Param('reseñaId') reseñaId: number,
  ): Promise<ReseñaEntity> {
    return await this.reseñaService.findClaseById(reseñaId);
  }
}

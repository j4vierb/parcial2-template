import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ReseñaEntity } from './reseña.entity';
import { Repository } from 'typeorm';
import {
  BussinessError,
  BussinessLogicException,
} from 'src/shared/business-errors';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';

@Injectable()
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseñaService {
  @InjectRepository(ReseñaEntity)
  private readonly reseñaRepository: Repository<ReseñaEntity>;

  @InjectRepository(EstudianteEntity)
  private readonly estudianteRepository: Repository<EstudianteEntity>;

  @InjectRepository(ActividadEntity)
  private readonly actividadRepository: Repository<ActividadEntity>;

  async agregarReseña(
    reseña: ReseñaEntity,
    estudianteId: number,
    actividadId: number,
  ) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
    });

    if (!estudiante) {
      throw new BussinessLogicException(
        'estudiante no encontrado',
        BussinessError.NOT_FOUND,
      );
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
    });

    if (!actividad) {
      throw new BussinessLogicException(
        'actividad no encontrada',
        BussinessError.NOT_FOUND,
      );
    }

    if (actividad.estado == 0) {
      throw new BussinessLogicException(
        'actividad no finalizada',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    const actividadEstudiante = estudiante.actividades.find(
      (actividad) => actividad.id == actividadId,
    );

    if (!actividadEstudiante) {
      throw new BussinessLogicException(
        'estudiante no estuvo inscrito en la actividad',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    actividad.reseña.push(reseña);
    return await this.reseñaRepository.save(reseña);
  }

  async findClaseById(id: number) {
    const clase = await this.reseñaRepository.find({ where: { id } });

    if (!clase) {
      throw new BussinessLogicException(
        'no se encontro la reseña',
        BussinessError.NOT_FOUND,
      );
    }

    return clase;
  }
}

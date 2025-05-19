import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';
import { Repository } from 'typeorm';
import {
  BussinessError,
  BussinessLogicException,
} from '../shared/business-errors';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';

@Injectable()
export class ReseñaService {
  @InjectRepository(ReseñaEntity)
  private readonly reseñaRepository: Repository<ReseñaEntity>;

  @InjectRepository(EstudianteEntity)
  private readonly estudianteRepository: Repository<EstudianteEntity>;

  @InjectRepository(ActividadEntity)
  private readonly actividadRepository: Repository<ActividadEntity>;

  /**
   * La actividad esta finalizada y el estudiante estuvo inscrito en la actividad
   */
  async agregarReseña(
    reseña: ReseñaEntity,
    estudianteId: number,
    actividadId: number,
  ) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
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

    if (actividad.estado !== 2) {
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

    reseña.estudiante = estudiante;
    reseña.actividad = actividad;
    await this.reseñaRepository.save(reseña);
    const newReseña = await this.reseñaRepository.findOne({
      where: { id: reseña.id },
    });
    if (!newReseña) {
      throw new BussinessLogicException(
        'no se pudo guardar la reseña',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    return newReseña;
  }

  async findClaseById(id: number) {
    const clase = await this.reseñaRepository.findOne({ where: { id } });

    if (!clase) {
      throw new BussinessLogicException(
        'no se encontro la reseña',
        BussinessError.NOT_FOUND,
      );
    }

    return clase;
  }
}

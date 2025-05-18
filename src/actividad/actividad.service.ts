import { Injectable, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ActividadEntity } from './actividad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BussinessError,
  BussinessLogicException,
} from 'src/shared/business-errors';

@Injectable()
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadService {
  @InjectRepository(ActividadEntity)
  private readonly actividadRepository: Repository<ActividadEntity>;

  async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
    if (actividad.estado != 0) {
      throw new BussinessLogicException(
        'El estado de la actividad no es valido: toda actividad debe crearse como abierta',
        BussinessError.PRECONDITION_FAILED,
      );
    }
    if (actividad.titulo.length < 15) {
      throw new BussinessLogicException(
        'El titulo debe ser de al menos 15 caracteres',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    if (!actividad.titulo.match(/[^a-zA-Z0-9]/)) {
      throw new BussinessLogicException(
        'El titulo no puede tener simbolos',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    return this.actividadRepository.save(actividad);
  }

  /**
   * 0: abierta
   * 1: cerrada
   * 2: finalizada
   */
  async cambiarEstado(
    actividadId: number,
    estado: number,
  ): Promise<ActividadEntity> {
    if (estado != 0 && estado != 1 && estado != 2) {
      throw new BussinessLogicException(
        'El estado no es valido',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    if (estado === 0) {
      throw new BussinessLogicException(
        'No se puede abrir una actividad que ya esta abierta',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });

    if (!actividad) {
      throw new BussinessLogicException(
        'Actividad no existe',
        BussinessError.NOT_FOUND,
      );
    }

    if (estado === 2) {
      if (actividad.cupoMaximo !== actividad.estudiantes.length) {
        throw new BussinessLogicException(
          'No se puede finalizar la actividad porque no se ha alcanzado el cupo maximo',
          BussinessError.PRECONDITION_FAILED,
        );
      } else {
        actividad.estado = estado;
      }
    }

    if (estado === 1) {
      const estudiantes = actividad.estudiantes.length;
      const cupoMaximo = actividad.cupoMaximo;

      if (estudiantes / cupoMaximo >= 0.8) {
        actividad.estado = estado;
      } else {
        throw new BussinessLogicException(
          'No se puede cerrar la actividad, el cupo no es suficiente',
          BussinessError.PRECONDITION_FAILED,
        );
      }
    }

    return this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    const actividades = await this.actividadRepository.find({
      where: { fecha },
    });

    if (actividades.length == 0) {
      throw new BussinessLogicException(
        'no hay actividades',
        BussinessError.NOT_FOUND,
      );
    }

    return actividades;
  }
}

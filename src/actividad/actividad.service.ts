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
    if (actividad.titulo.length < 15) {
      throw new BussinessLogicException(
        'El titulo debe ser de al menos 15 caracteres',
        BussinessError.PRECONDITION_FAILED,
      );
    }
    // no simbolos

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

  async cambiarEstadoActividad(actividadId: number, estado: number) {
    if (estado != 0 && estado != 1 && estado != 2) {
      throw new BussinessLogicException(
        'El estado no es valido',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    if (estado == 1) {
      const actividad = await this.actividadRepository.findOne({
        where: { id: actividadId },
      });
      if (!actividad) {
        throw new BussinessLogicException(
          'Actividad no existe',
          BussinessError.NOT_FOUND,
        );
      }
      const estudiantes = actividad.estudiantes.length;
      const cupoMaximo = actividad.cupoMaximo;
      if (estudiantes / cupoMaximo >= 0.8) {
        actividad.estado = estado;
        return this.actividadRepository.save(actividad);
      } else {
        throw new BussinessLogicException(
          'No se puede cerrar la actividad, el cupo no es suficiente',
          BussinessError.PRECONDITION_FAILED,
        );
      }
    }
  }
}

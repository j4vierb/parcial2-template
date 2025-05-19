import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';
import {
  BussinessError,
  BussinessLogicException,
} from '../shared/business-errors';
import { ActividadEntity } from '../actividad/actividad.entity';

@Injectable()
export class EstudianteService {
  @InjectRepository(EstudianteEntity)
  private readonly estudianteRepository: Repository<EstudianteEntity>;

  @InjectRepository(ActividadEntity)
  private readonly actividadRepository: Repository<ActividadEntity>;

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BussinessLogicException(
        'El semestre no es valido',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(estudiante.correo)) {
      throw new BussinessLogicException(
        'El email no es valido',
        BussinessError.PRECONDITION_FAILED,
      );
    }
    const simbolosRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (simbolosRegex.test(estudiante.nombre)) {
      throw new BussinessLogicException(
        'El nombre no es valido',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    return this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });

    if (!estudiante) {
      throw new BussinessLogicException(
        'Estudiante no existe',
        BussinessError.NOT_FOUND,
      );
    }

    return estudiante;
  }

  async inscribirseActividad(
    estudianteId: number,
    actividadId: number,
  ): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });

    if (!estudiante) {
      throw new BussinessLogicException(
        'Estudiante no existe',
        BussinessError.NOT_FOUND,
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

    if (actividad.estudiantes.length - actividad.cupoMaximo === 0) {
      throw new BussinessLogicException(
        'Actividad sin cupo',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    if (actividad.estado !== 0) {
      throw new BussinessLogicException(
        'Actividad no disponible',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    if (estudiante.actividades) {
      const actividadInscrita = estudiante.actividades.find(
        (actividad) => actividad.id === actividadId,
      );
      if (actividadInscrita) {
        throw new BussinessLogicException(
          'Estudiante ya inscrito en la actividad',
          BussinessError.PRECONDITION_FAILED,
        );
      }
    } else {
      throw new BussinessLogicException(
        'Estudiante no tiene actividades',
        BussinessError.PRECONDITION_FAILED,
      );
    }

    estudiante.actividades = [...(estudiante.actividades || []), actividad];

    return await this.estudianteRepository.save(estudiante);
  }
}

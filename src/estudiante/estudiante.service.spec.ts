import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let actividadRepository: Repository<ActividadEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let estudiante: EstudianteEntity;
  let actividad: ActividadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);

    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await actividadRepository.clear();
    await estudianteRepository.clear();

    actividad = await actividadRepository.save({
      titulo: 'actividad 1: practica de JS',
      fecha: '2025-04-26',
      cupoMaximo: 2,
      estado: 0,
    });

    estudiante = await estudianteRepository.save({
      id: 0,
      nombre: 'Juan',
      cedula: 123456789,
      correo: 'juan@gmail.com',
      programa: 'Ingeniería de Sistemas',
      semestre: 3,
      reseñas: [],
      actividades: [],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should to create an student', async () => {
    const savedStudent = await service.crearEstudiante(estudiante);
    expect(savedStudent).not.toBeNull();
    expect(savedStudent.nombre).toEqual(estudiante.nombre);
    expect(savedStudent.cedula).toEqual(estudiante.cedula);
    expect(savedStudent.correo).toEqual(estudiante.correo);
    expect(savedStudent.programa).toEqual(estudiante.programa);
    expect(savedStudent.semestre).toEqual(estudiante.semestre);
  });

  it('should to throw an exception due to invalid semester', async () => {
    estudiante.semestre = 11;

    await expect(() =>
      service.crearEstudiante(estudiante),
    ).rejects.toHaveProperty('message', 'El semestre no es valido');
  });

  it('should to return an student by id', async () => {
    const foundStudent = await service.findEstudianteById(estudiante.id);
    expect(foundStudent).not.toBeNull();
    expect(foundStudent.nombre).toEqual(estudiante.nombre);
    expect(foundStudent.cedula).toEqual(estudiante.cedula);
    expect(foundStudent.correo).toEqual(estudiante.correo);
    expect(foundStudent.programa).toEqual(estudiante.programa);
    expect(foundStudent.semestre).toEqual(estudiante.semestre);
  });

  it('should to throw an exception due to student not found', async () => {
    await expect(
      service.findEstudianteById(estudiante.id + 1),
    ).rejects.toHaveProperty('message', 'Estudiante no existe');
  });

  it('should to enroll an student in an activity', async () => {
    const savedStudent = await service.inscribirseActividad(
      estudiante.id,
      actividad.id,
    );

    expect(savedStudent).not.toBeNull();
    expect(savedStudent.actividades.length).toEqual(1);
    expect(savedStudent.actividades[0].titulo).toEqual(actividad.titulo);
  });

  it('should to throw an exception due to student already enrolled in activity', async () => {
    actividad.estudiantes = [estudiante];
    await actividadRepository.save(actividad);
    await expect(() =>
      service.inscribirseActividad(estudiante.id, actividad.id),
    ).rejects.toHaveProperty(
      'message',
      'Estudiante ya inscrito en la actividad',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { faker } from '@faker-js/faker/.';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepository: Repository<ActividadEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividad: ActividadEntity;
  let unsavedActividad: ActividadEntity;
  let estudiantes: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActividadService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ActividadService>(ActividadService);

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
    estudiantes = [];

    actividad = await actividadRepository.save({
      titulo: 'actividad 1: practica de JS',
      fecha: '2025-04-26',
      cupoMaximo: 10,
      estado: 0,
    });

    unsavedActividad = {
      titulo: 'actividad 1: practica de JS',
      fecha: '2025-04-26',
      cupoMaximo: 2,
      estado: 0,
      id: 0,
      estudiantes: [],
      reseña: [],
    };

    for (let i = 0; i < 8; i++) {
      const toSaveStudent = {
        id: i,
        nombre: faker.person.firstName(),
        cedula: faker.number.int(),
        correo: faker.internet.email(),
        programa: faker.lorem.word(),
        semestre: 3,
        reseñas: [],
        actividades: [actividad],
      };

      estudiantes.push(toSaveStudent);
      await estudianteRepository.save(toSaveStudent);
    }

    actividad.estudiantes = estudiantes;
    await actividadRepository.save(actividad);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should to create an activity', async () => {
    const savedActivity = await service.crearActividad(unsavedActividad);
    expect(savedActivity).not.toBeNull();
    expect(savedActivity.titulo).toEqual(unsavedActividad.titulo);
    expect(savedActivity.fecha).toEqual(unsavedActividad.fecha);
    expect(savedActivity.cupoMaximo).toEqual(unsavedActividad.cupoMaximo);
    expect(savedActivity.estado).toEqual(unsavedActividad.estado);
  });

  it('should to throw an exception to create an activity with invalid title', async () => {
    unsavedActividad.titulo = ' ';
    await expect(
      service.crearActividad(unsavedActividad),
    ).rejects.toHaveProperty(
      'message',
      'El titulo debe ser de al menos 15 caracteres',
    );
  });

  it('should to change the state of an activity', async () => {
    const changedActivity = await service.cambiarEstado(actividad.id, 1);
    expect(changedActivity).not.toBeNull();
    expect(changedActivity.estado).toEqual(1);
    expect(changedActivity.titulo).toEqual(actividad.titulo);
    expect(changedActivity.fecha).toEqual(actividad.fecha);
    expect(changedActivity.cupoMaximo).toEqual(actividad.cupoMaximo);
  });

  it('should to throw an exception when trying to change the state the activity to 1 with invalid ocupation', async () => {
    actividad.cupoMaximo = 20;
    await actividadRepository.save(actividad);
    await expect(() =>
      service.cambiarEstado(actividad.id, 1),
    ).rejects.toHaveProperty(
      'message',
      'No se puede cerrar la actividad, el cupo no es suficiente',
    );
  });

  it('should to get all the activities with the same date', async () => {
    actividad.cupoMaximo = 2;
    await actividadRepository.save(unsavedActividad);
    const activities: ActividadEntity[] =
      await service.findAllActividadesByDate('2025-04-26');

    expect(activities).not.toBeNull();
    expect(activities.length).toEqual(2);
    expect(activities[0].titulo).toEqual(actividad.titulo);
    expect(activities[0].fecha).toEqual(actividad.fecha);
    expect(activities[0].cupoMaximo).toEqual(actividad.cupoMaximo);
    expect(activities[0].estado).toEqual(actividad.estado);
  });

  it('should to throw an exception when trying to get all the activities with the same date', async () => {
    await expect(() =>
      service.findAllActividadesByDate('3/06/1999'),
    ).rejects.toHaveProperty('message', 'no hay actividades');
  });
});

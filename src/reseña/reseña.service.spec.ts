import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ReseñaService } from './reseña.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ReseñaEntity } from './reseña.entity';
import { faker } from '@faker-js/faker';

describe('ReseñaService', () => {
  let service: ReseñaService;
  let reseñaRepository: Repository<ReseñaEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let estudiante: EstudianteEntity;
  let actividad: ActividadEntity;
  let reseña: ReseñaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseñaService],
    }).compile();

    service = module.get<ReseñaService>(ReseñaService);

    reseñaRepository = module.get<Repository<ReseñaEntity>>(
      getRepositoryToken(ReseñaEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await reseñaRepository.clear();
    await actividadRepository.clear();
    await estudianteRepository.clear();

    estudiante = await estudianteRepository.save({
      nombre: faker.person.firstName(),
      cedula: faker.number.int(),
      correo: faker.internet.email(),
      programa: faker.lorem.word(),
      semestre: 3,
    });

    actividad = await actividadRepository.save({
      titulo: faker.lorem.word(),
      fecha: '26-04-2025',
      cupoMaximo: 2,
      estado: 2,
    });

    reseña = await reseñaRepository.save({
      id: 0,
      comentario: faker.lorem.sentence(),
      calificacion: 5,
      actividad: actividad,
      estudiante: estudiante,
      fecha: '26-06-2025',
    });

    actividad.estudiantes = [estudiante];
    await actividadRepository.save(actividad);
    await reseñaRepository.save(reseña);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should to create a new "ReseñaEntity"', async () => {
    const result = await service.agregarReseña(
      reseña,
      estudiante.id,
      actividad.id,
    );

    expect(result).not.toBeNull();
    expect(result.comentario).toEqual(reseña.comentario);
    expect(result.calificacion).toEqual(reseña.calificacion);
  });

  it('should throw an exception for unfinished activity', async () => {
    actividad = await actividadRepository.save({
      titulo: faker.lorem.word(),
      fecha: '26-04-2025',
      cupoMaximo: 2,
      estado: 0,
    });

    await expect(() =>
      service.agregarReseña(reseña, estudiante.id, actividad.id),
    ).rejects.toHaveProperty('message', 'actividad no finalizada');
  });

  it('should throw an exception for non-existent activity', async () => {
    actividad.id = -1;
    await expect(() =>
      service.agregarReseña(reseña, estudiante.id, actividad.id),
    ).rejects.toHaveProperty('message', 'actividad no encontrada');
  });

  it('should to return the "ReseñaEntity" by id', async () => {
    const result: ReseñaEntity = await service.findClaseById(reseña.id);

    expect(result).not.toBeNull();
    expect(result.comentario).toEqual(reseña.comentario);
    expect(result.calificacion).toEqual(reseña.calificacion);
  });
});

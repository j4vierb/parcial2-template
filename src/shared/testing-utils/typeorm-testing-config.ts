import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from '../../actividad/actividad.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity';
import { ReseñaEntity } from '../../reseña/reseña.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ActividadEntity, EstudianteEntity, ReseñaEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([ActividadEntity, EstudianteEntity, ReseñaEntity]),
];

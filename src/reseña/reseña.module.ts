import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';

@Module({
  providers: [ReseñaService],
  imports: [
    TypeOrmModule.forFeature([ReseñaEntity, EstudianteEntity, ActividadEntity]),
  ],
})
export class ReseñaModule {}

import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { ReseñaController } from './reseña.controller';

@Module({
  providers: [ReseñaService],
  imports: [
    TypeOrmModule.forFeature([ReseñaEntity, EstudianteEntity, ActividadEntity]),
  ],
  controllers: [ReseñaController],
})
export class ReseñaModule {}

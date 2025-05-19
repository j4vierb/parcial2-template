import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteController } from './estudiante.controller';

@Module({
  providers: [EstudianteService],
  imports: [TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity])],
  controllers: [EstudianteController],
})
export class EstudianteModule {}

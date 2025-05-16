import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ActividadService],
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
})
export class ActividadModule {}

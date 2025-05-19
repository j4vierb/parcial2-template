import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseñaModule } from './reseña/reseña.module';
import { ActividadEntity } from './actividad/actividad.entity';
import { ReseñaEntity } from './reseña/reseña.entity';
import { EstudianteEntity } from './estudiante/estudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [ActividadEntity, ReseñaEntity, EstudianteEntity],
      synchronize: true,
      dropSchema: true,
    }),
    EstudianteModule,
    ActividadModule,
    ReseñaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseModule } from './base/base.module';
import { ExampleEntity } from './base/example.entity';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseñaModule } from './reseña/reseña.module';

@Module({
  imports: [
    BaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [ExampleEntity],
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

import { ActividadEntity } from '../actividad/actividad.entity';
import { ReseñaEntity } from '../reseña/reseña.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EstudianteEntity {
  @Column('bigint')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  cedula: number;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @OneToMany(() => ReseñaEntity, (reseña: ReseñaEntity) => reseña.estudiante)
  reseñas: ReseñaEntity[];

  @ManyToMany(() => ActividadEntity, (actividades) => actividades.estudiantes)
  actividades: ActividadEntity[];
}

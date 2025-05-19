import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ReseñaEntity } from '../reseña/reseña.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActividadEntity {
  @Column('bigint')
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column()
  cupoMaximo: number;

  @Column()
  estado: number;

  @ManyToMany(() => EstudianteEntity, (estudiantes) => estudiantes.actividades)
  @JoinTable()
  estudiantes: EstudianteEntity[];

  @OneToMany(() => ReseñaEntity, (reseña) => reseña.actividad)
  reseña: ReseñaEntity[];
}

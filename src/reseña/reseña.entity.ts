import { ActividadEntity } from 'src/actividad/actividad.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReseñaEntity {
  @PrimaryGeneratedColumn()
  @Column('bigint')
  id: number;

  @Column()
  comentario: string;

  @Column()
  calificacion: number;

  @Column()
  fecha: string;

  @ManyToOne(() => EstudianteEntity, (reseña) => reseña.reseñas)
  estudiante: EstudianteEntity;

  @ManyToOne(() => ActividadEntity, (actividad) => actividad.reseña)
  actividad: ActividadEntity;
}

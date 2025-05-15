import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExampleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  saldo: number;
}

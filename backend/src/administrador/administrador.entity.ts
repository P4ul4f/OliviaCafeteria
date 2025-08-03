import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Administrador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario: string;

  @Column()
  contrasena: string;
} 
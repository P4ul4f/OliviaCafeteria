import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class FechasConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column('jsonb')
  turnos: string[];

  @Column({ default: true })
  activa: boolean;

  @Column({ nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
} 
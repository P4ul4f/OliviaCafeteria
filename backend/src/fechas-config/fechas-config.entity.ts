import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class FechasConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'date', // Usar tipo 'date' para evitar problemas de zona horaria
    comment: 'Fecha en formato YYYY-MM-DD sin zona horaria'
  })
  fecha: Date;

  @Column()
  tipoReserva: string;

  @Column('jsonb')
  turnos: string[];

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class FechasConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'text', // Usar tipo 'text' para almacenar strings de fecha sin problemas de zona horaria
    comment: 'Fecha en formato YYYY-MM-DD como string'
  })
  fecha: string; // Solo string para consistencia total

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
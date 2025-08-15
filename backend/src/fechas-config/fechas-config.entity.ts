import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fechas_config')
export class FechasConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', comment: 'Fecha de la configuración' })
  fecha: Date;

  @Column({ type: 'varchar', comment: 'Tipo de reserva' })
  tipoReserva: string;

  @Column({ type: 'boolean', default: true, comment: 'Indica si la fecha está activa' })
  activo: boolean;

  @Column({ type: 'jsonb', nullable: true, comment: 'Turnos disponibles con horarios y cupos' })
  turnos: any;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fechas_config')
export class FechasConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    comment: 'Fecha de la configuración'
  })
  fecha: Date;

  @Column({
    type: 'varchar',
    comment: 'Tipo de reserva (merienda-libre, tarde-te, a-la-carta)'
  })
  tipoReserva: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Turnos disponibles con horarios y cupos'
  })
  turnos: any;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Cupos totales disponibles'
  })
  cupos: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si la fecha está activa'
  })
  activa: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Observaciones adicionales'
  })
  observaciones: string;

  @CreateDateColumn({
    name: 'fechaCreacion'
  })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fechaActualizacion'
  })
  fechaActualizacion: Date;
} 
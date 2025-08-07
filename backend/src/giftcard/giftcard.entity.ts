import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoGiftCard {
  PAGADA = 'PAGADA',
  ENVIADA = 'ENVIADA',
  CANCELADA = 'CANCELADA',
}

@Entity()
export class GiftCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreComprador: string;

  @Column()
  telefonoComprador: string;

  @Column()
  emailComprador: string;

  @Column()
  nombreDestinatario: string;

  @Column()
  telefonoDestinatario: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @Column({
    type: 'enum',
    enum: EstadoGiftCard,
    default: EstadoGiftCard.PAGADA,
  })
  estado: EstadoGiftCard;

  @Column({ nullable: true })
  idPagoExterno: string;

  @Column({ nullable: true })
  metodoPago: string;

  @CreateDateColumn({ name: 'fechaCreacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fechaActualizacion' })
  fechaActualizacion: Date;
} 
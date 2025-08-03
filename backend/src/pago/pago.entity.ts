import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';
import { GiftCard } from '../giftcard/giftcard.entity';

export enum MetodoPago {
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
  MERCADO_PAGO = 'mercado pago',
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  EN_PROCESO = 'EN_PROCESO',
  RECHAZADO = 'RECHAZADO',
  CANCELADO = 'CANCELADO',
}

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  reservaId: number;

  @Column({ nullable: true })
  giftCardId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp' })
  fechaPago: Date;

  @Column({
    type: 'enum',
    enum: MetodoPago
  })
  metodo: MetodoPago;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE
  })
  estado: EstadoPago;

  @Column({ nullable: true })
  idPagoExterno: string;

  @Column({ type: 'text', nullable: true })
  datosPago: string;

  @ManyToOne(() => Reserva, { nullable: true })
  @JoinColumn({ name: 'reservaId' })
  reserva?: Reserva;

  @ManyToOne(() => GiftCard, { nullable: true })
  @JoinColumn({ name: 'giftCardId' })
  giftCard?: GiftCard;
} 
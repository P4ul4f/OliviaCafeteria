import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
}

export enum TipoReserva {
  A_LA_CARTA = 'a-la-carta',
  MERIENDA_LIBRE = 'merienda-libre',
  TARDE_TE = 'tarde-te',
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  RECHAZADO = 'RECHAZADO',
}

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCliente: string;

  @Column()
  telefono: string;

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @Column()
  turno: string;

  @Column()
  cantidadPersonas: number;

  @Column({
    type: 'enum',
    enum: TipoReserva
  })
  tipoReserva: TipoReserva;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  montoSenia: number;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE
  })
  estado: EstadoReserva;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE
  })
  estadoPago: EstadoPago;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ nullable: true })
  idPagoExterno: string; // ID del pago en Mercado Pago/Stripe

  @Column({ nullable: true })
  metodoPago: string; // 'mercadopago', 'stripe', etc.

  @Column({ type: 'boolean', default: false, nullable: true })
  recordatorio48hEnviado?: boolean; // Trackear si el recordatorio de 48h fue enviado
} 
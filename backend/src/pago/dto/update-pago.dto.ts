import { MetodoPago, EstadoPago } from '../pago.entity';

export class UpdatePagoDto {
  reservaId?: number;
  monto?: number;
  fechaPago?: Date;
  metodo?: MetodoPago;
  estado?: EstadoPago;
  idPagoExterno?: string;
  datosPago?: string;
} 
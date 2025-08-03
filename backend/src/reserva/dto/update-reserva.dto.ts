import { EstadoReserva } from '../reserva.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateReservaDto {
  fechaHora?: Date;
  nombreCliente?: string;
  telefono?: string;
  montoSenia?: number;
  cantidadPersonas?: number;
  @IsOptional()
  @IsEnum(EstadoReserva, { message: 'El estado debe ser PENDIENTE, CONFIRMADA o CANCELADA' })
  estado?: EstadoReserva;
} 
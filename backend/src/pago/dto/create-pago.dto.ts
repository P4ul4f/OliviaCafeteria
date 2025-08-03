import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { MetodoPago, EstadoPago } from '../pago.entity';

export class CreatePagoDto {
  @IsNotEmpty({ message: 'El ID de reserva es obligatorio' })
  @IsNumber({}, { message: 'El ID de reserva debe ser un número' })
  reservaId: number;

  @IsNotEmpty({ message: 'El monto es obligatorio' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0, { message: 'El monto no puede ser negativo' })
  monto: number;

  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @IsEnum(MetodoPago, { message: 'Método de pago no válido' })
  metodo: MetodoPago;

  @IsOptional()
  @IsString({ message: 'El ID de pago externo debe ser texto' })
  idPagoExterno?: string;

  @IsOptional()
  @IsEnum(EstadoPago, { message: 'Estado de pago no válido' })
  estado?: EstadoPago;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de pago debe tener formato válido' })
  fechaPago?: Date;

  @IsOptional()
  @IsString({ message: 'Los datos de pago deben ser texto' })
  datosPago?: string;
} 
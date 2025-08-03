import { IsNotEmpty, IsString, IsNumber, IsEnum, IsDateString, IsOptional, Min, Max, Length } from 'class-validator';
import { EstadoReserva, EstadoPago, TipoReserva } from '../reserva.entity';

export class CreateReservaDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombreCliente: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono: string;

  @IsNotEmpty({ message: 'La cantidad de personas es obligatoria' })
  @IsNumber({}, { message: 'La cantidad de personas debe ser un número' })
  @Min(1, { message: 'La cantidad mínima es 1 persona' })
  @Max(30, { message: 'La cantidad máxima es 30 personas' })
  cantidadPersonas: number;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  fechaHora: Date;

  @IsNotEmpty({ message: 'El turno es obligatorio' })
  @IsString({ message: 'El turno debe ser una cadena de texto' })
  turno: string;

  @IsNotEmpty({ message: 'El tipo de reserva es obligatorio' })
  @IsEnum(TipoReserva, { message: 'El tipo de reserva debe ser merienda-libre o tarde-te' })
  tipoReserva: TipoReserva;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El monto total debe ser un número' })
  montoTotal?: number;
}

export class CreateReservaConPagoDto extends CreateReservaDto {
  @IsOptional()
  @IsNumber({}, { message: 'El monto de seña debe ser un número' })
  montoSenia?: number;

  @IsOptional()
  @IsEnum(EstadoReserva, { message: 'El estado de reserva no es válido' })
  estado?: EstadoReserva;

  @IsOptional()
  @IsEnum(EstadoPago, { message: 'El estado de pago no es válido' })
  estadoPago?: EstadoPago;

  @IsOptional()
  @IsString({ message: 'El ID de pago externo debe ser texto' })
  idPagoExterno?: string;

  @IsOptional()
  @IsString({ message: 'El método de pago debe ser texto' })
  metodoPago?: string;
} 
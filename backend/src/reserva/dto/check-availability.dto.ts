import { IsNotEmpty, IsString, IsNumber, IsEnum, IsDateString, Min, Max } from 'class-validator';
import { TipoReserva } from '../reserva.entity';

export class CheckAvailabilityDto {
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  fecha: Date;

  @IsNotEmpty({ message: 'El turno es obligatorio' })
  @IsString({ message: 'El turno debe ser una cadena de texto' })
  turno: string;

  @IsNotEmpty({ message: 'El tipo de reserva es obligatorio' })
  @IsEnum(TipoReserva, { message: 'El tipo de reserva debe ser merienda-libre o tarde-te' })
  tipoReserva: TipoReserva;

  @IsNotEmpty({ message: 'La cantidad de personas es obligatoria' })
  @IsNumber({}, { message: 'La cantidad de personas debe ser un número' })
  @Min(1, { message: 'La cantidad mínima es 1 persona' })
  @Max(30, { message: 'La cantidad máxima es 30 personas' })
  cantidadPersonas: number;
} 
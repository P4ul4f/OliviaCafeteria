import { TipoReserva } from '../reserva.entity';
export declare class CheckAvailabilityDto {
    fecha: Date;
    turno: string;
    tipoReserva: TipoReserva;
    cantidadPersonas: number;
}

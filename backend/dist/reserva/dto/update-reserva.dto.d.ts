import { EstadoReserva } from '../reserva.entity';
export declare class UpdateReservaDto {
    fechaHora?: Date;
    nombreCliente?: string;
    telefono?: string;
    montoSenia?: number;
    cantidadPersonas?: number;
    estado?: EstadoReserva;
}

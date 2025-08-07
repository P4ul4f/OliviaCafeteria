import { EstadoReserva, EstadoPago, TipoReserva } from '../reserva.entity';
export declare class CreateReservaDto {
    nombreCliente: string;
    telefono: string;
    cantidadPersonas: number;
    fechaHora: Date;
    turno: string;
    tipoReserva: TipoReserva;
    observaciones?: string;
    montoTotal?: number;
}
export declare class CreateReservaConPagoDto extends CreateReservaDto {
    montoSenia?: number;
    estado?: EstadoReserva;
    estadoPago?: EstadoPago;
    idPagoExterno?: string;
    metodoPago?: string;
}

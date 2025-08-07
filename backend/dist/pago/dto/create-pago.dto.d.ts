import { MetodoPago, EstadoPago } from '../pago.entity';
export declare class CreatePagoDto {
    reservaId: number;
    monto: number;
    metodo: MetodoPago;
    idPagoExterno?: string;
    estado?: EstadoPago;
    fechaPago?: Date;
    datosPago?: string;
}

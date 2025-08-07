import { Reserva } from '../reserva/reserva.entity';
import { GiftCard } from '../giftcard/giftcard.entity';
export declare enum MetodoPago {
    TARJETA = "tarjeta",
    TRANSFERENCIA = "transferencia",
    MERCADO_PAGO = "mercado pago"
}
export declare enum EstadoPago {
    PENDIENTE = "PENDIENTE",
    APROBADO = "APROBADO",
    EN_PROCESO = "EN_PROCESO",
    RECHAZADO = "RECHAZADO",
    CANCELADO = "CANCELADO"
}
export declare class Pago {
    id: number;
    reservaId: number;
    giftCardId: number;
    monto: number;
    fechaPago: Date;
    metodo: MetodoPago;
    estado: EstadoPago;
    idPagoExterno: string;
    datosPago: string;
    reserva?: Reserva;
    giftCard?: GiftCard;
}

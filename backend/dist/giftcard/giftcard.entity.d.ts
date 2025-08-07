export declare enum EstadoGiftCard {
    PAGADA = "PAGADA",
    ENVIADA = "ENVIADA",
    CANCELADA = "CANCELADA"
}
export declare class GiftCard {
    id: number;
    nombreComprador: string;
    telefonoComprador: string;
    emailComprador: string;
    nombreDestinatario: string;
    telefonoDestinatario: string;
    monto: number;
    mensaje: string;
    estado: EstadoGiftCard;
    idPagoExterno: string;
    metodoPago: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}

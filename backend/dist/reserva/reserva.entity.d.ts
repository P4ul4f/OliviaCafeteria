export declare enum EstadoReserva {
    PENDIENTE = "PENDIENTE",
    CONFIRMADA = "CONFIRMADA",
    CANCELADA = "CANCELADA"
}
export declare enum TipoReserva {
    A_LA_CARTA = "a-la-carta",
    MERIENDA_LIBRE = "merienda-libre",
    TARDE_TE = "tarde-te"
}
export declare enum EstadoPago {
    PENDIENTE = "PENDIENTE",
    PAGADO = "PAGADO",
    RECHAZADO = "RECHAZADO"
}
export declare class Reserva {
    id: number;
    nombreCliente: string;
    telefono: string;
    fechaHora: Date;
    turno: string;
    cantidadPersonas: number;
    tipoReserva: TipoReserva;
    montoTotal: number;
    montoSenia: number;
    estado: EstadoReserva;
    estadoPago: EstadoPago;
    fechaCreacion: Date;
    idPagoExterno: string;
    metodoPago: string;
    recordatorio48hEnviado: boolean;
}

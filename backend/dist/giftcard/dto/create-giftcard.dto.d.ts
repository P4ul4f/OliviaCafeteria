export declare class CreateGiftCardDto {
    nombreComprador: string;
    telefonoComprador: string;
    emailComprador: string;
    nombreDestinatario: string;
    telefonoDestinatario: string;
    monto: number;
    mensaje?: string;
}
export declare class CreateGiftCardConPagoDto extends CreateGiftCardDto {
    idPagoExterno?: string;
    metodoPago?: string;
}

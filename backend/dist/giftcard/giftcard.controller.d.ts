import { GiftCardService } from './giftcard.service';
import { CreateGiftCardDto, CreateGiftCardConPagoDto } from './dto/create-giftcard.dto';
export declare class GiftCardController {
    private readonly giftCardService;
    constructor(giftCardService: GiftCardService);
    createConPago(dto: CreateGiftCardConPagoDto): Promise<import("./giftcard.entity").GiftCard>;
    findAll(): Promise<import("./giftcard.entity").GiftCard[]>;
    findOne(id: string): Promise<import("./giftcard.entity").GiftCard | null>;
    update(id: string, dto: Partial<CreateGiftCardDto>): Promise<import("./giftcard.entity").GiftCard | null>;
    remove(id: string): Promise<boolean>;
    confirmarPago(id: string, data: {
        idPagoExterno: string;
        metodoPago: string;
    }): Promise<import("./giftcard.entity").GiftCard>;
    enviarGiftCard(id: string): Promise<import("./giftcard.entity").GiftCard>;
}

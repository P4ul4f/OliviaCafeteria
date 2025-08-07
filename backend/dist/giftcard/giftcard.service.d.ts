import { Repository } from 'typeorm';
import { GiftCard } from './giftcard.entity';
import { CreateGiftCardConPagoDto } from './dto/create-giftcard.dto';
export declare class GiftCardService {
    private giftCardRepository;
    constructor(giftCardRepository: Repository<GiftCard>);
    createConPago(dto: CreateGiftCardConPagoDto): Promise<GiftCard>;
    findAll(): Promise<GiftCard[]>;
    findOne(id: number): Promise<GiftCard | null>;
    update(id: number, dto: Partial<GiftCard>): Promise<GiftCard | null>;
    remove(id: number): Promise<boolean>;
    confirmarPago(id: number, idPagoExterno: string, metodoPago: string): Promise<GiftCard>;
    enviarGiftCard(id: number): Promise<GiftCard>;
}

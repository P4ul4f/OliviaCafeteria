import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftCard, EstadoGiftCard } from './giftcard.entity';
import { CreateGiftCardDto, CreateGiftCardConPagoDto } from './dto/create-giftcard.dto';

@Injectable()
export class GiftCardService {
  constructor(
    @InjectRepository(GiftCard)
    private giftCardRepository: Repository<GiftCard>,
  ) {}

  async createConPago(dto: CreateGiftCardConPagoDto): Promise<GiftCard> {
    const giftCard = this.giftCardRepository.create({
      ...dto,
      estado: EstadoGiftCard.PAGADA,
    });

    return this.giftCardRepository.save(giftCard);
  }

  async findAll(): Promise<GiftCard[]> {
    return this.giftCardRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<GiftCard | null> {
    return this.giftCardRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: Partial<GiftCard>): Promise<GiftCard | null> {
    const giftCard = await this.findOne(id);
    if (giftCard) {
      Object.assign(giftCard, dto);
      return this.giftCardRepository.save(giftCard);
    }
    return null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.giftCardRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async confirmarPago(id: number, idPagoExterno: string, metodoPago: string): Promise<GiftCard> {
    const giftCard = await this.findOne(id);
    if (!giftCard) {
      throw new BadRequestException('Gift Card no encontrada');
    }

    giftCard.estado = EstadoGiftCard.PAGADA;
    giftCard.idPagoExterno = idPagoExterno;
    giftCard.metodoPago = metodoPago;

    return this.giftCardRepository.save(giftCard);
  }

  async enviarGiftCard(id: number): Promise<GiftCard> {
    const giftCard = await this.findOne(id);
    if (!giftCard) {
      throw new BadRequestException('Gift Card no encontrada');
    }

    if (giftCard.estado !== EstadoGiftCard.PAGADA) {
      throw new BadRequestException('La Gift Card debe estar pagada para ser enviada');
    }

    giftCard.estado = EstadoGiftCard.ENVIADA;

    return this.giftCardRepository.save(giftCard);
  }
} 
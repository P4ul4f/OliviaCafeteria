import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { Pago } from './pago.entity';
import { ReservaModule } from '../reserva/reserva.module';
import { GiftCardModule } from '../giftcard/giftcard.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    ReservaModule, // Importar para usar ReservaService
    GiftCardModule, // Importar para usar GiftCardService
    WhatsappModule, // Importar para usar WhatsappService
  ],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {} 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { Pago } from './pago.entity';
import { ReservaModule } from '../reserva/reserva.module';
import { GiftCardModule } from '../giftcard/giftcard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    ReservaModule, // Importar para usar ReservaService
    GiftCardModule, // Importar para usar GiftCardService
  ],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {} 
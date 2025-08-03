import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCardService } from './giftcard.service';
import { GiftCardController } from './giftcard.controller';
import { GiftCard } from './giftcard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GiftCard])],
  controllers: [GiftCardController],
  providers: [GiftCardService],
  exports: [GiftCardService],
})
export class GiftCardModule {} 
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { GiftCardService } from './giftcard.service';
import { CreateGiftCardDto, CreateGiftCardConPagoDto } from './dto/create-giftcard.dto';

@Controller('giftcard')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Post('crear-con-pago')
  async createConPago(@Body() dto: CreateGiftCardConPagoDto) {
    return this.giftCardService.createConPago(dto);
  }

  @Get()
  async findAll() {
    return this.giftCardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.giftCardService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateGiftCardDto>) {
    return this.giftCardService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.giftCardService.remove(+id);
  }

  @Patch(':id/confirmar-pago')
  async confirmarPago(
    @Param('id') id: string,
    @Body() data: { idPagoExterno: string; metodoPago: string }
  ) {
    return this.giftCardService.confirmarPago(+id, data.idPagoExterno, data.metodoPago);
  }

  @Patch(':id/enviar')
  async enviarGiftCard(@Param('id') id: string) {
    return this.giftCardService.enviarGiftCard(+id);
  }
} 
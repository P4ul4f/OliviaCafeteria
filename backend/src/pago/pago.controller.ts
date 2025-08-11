import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Controller('pago')
export class PagoController {
  private readonly logger = new Logger(PagoController.name);

  constructor(private readonly pagoService: PagoService) {}

  @Post('crear-preferencia')
  async crearPreferencia(@Body() body: { 
    reservaData: any; 
    monto: number; 
    descripcion: string; 
  }) {
    this.logger.log(`📝 Creando preferencia para: ${body.reservaData?.nombre}`);
    
    return this.pagoService.crearPreferenciaMercadoPago(
      body.reservaData,
      body.monto,
      body.descripcion,
    );
  }

  @Post('crear-preferencia-giftcard')
  async crearPreferenciaGiftCard(@Body() body: { 
    giftCardData: any; 
    monto: number; 
    descripcion: string; 
  }) {
    this.logger.log(`📝 Creando preferencia GiftCard para: ${body.giftCardData?.nombreComprador}`);
    
    return this.pagoService.crearPreferenciaGiftCard(
      body.giftCardData,
      body.monto,
      body.descripcion,
    );
  }

  @Post('pagar-con-tarjeta')
  async pagarConTarjeta(@Body() body: { 
    reservaData: any; 
    total: number; 
    descripcion: string; 
    datosLarjeta: any; 
  }) {
    this.logger.log(`💳 Solicitud de pago con tarjeta para: ${body.reservaData?.nombre}`);
    
    const { reservaData, total, descripcion, datosLarjeta } = body;
    
    if (!reservaData || !total || !descripcion || !datosLarjeta) {
      throw new Error('Datos incompletos para el pago con tarjeta');
    }
    
    return this.pagoService.procesarPagoTarjeta(
      reservaData,
      total,
      descripcion,
      datosLarjeta
    );
  }

  @Post('pagar-giftcard-con-tarjeta')
  async pagarGiftCardConTarjeta(@Body() body: { 
    giftCardData: any; 
    total: number; 
    descripcion: string; 
    datosLarjeta: any; 
  }) {
    this.logger.log(`💳 Solicitud de pago GiftCard con tarjeta para: ${body.giftCardData?.nombreComprador}`);
    
    const { giftCardData, total, descripcion, datosLarjeta } = body;
    
    if (!giftCardData || !total || !descripcion || !datosLarjeta) {
      throw new Error('Datos incompletos para el pago de GiftCard con tarjeta');
    }
    
    return this.pagoService.procesarPagoTarjetaGiftCard(
      giftCardData,
      total,
      descripcion,
      datosLarjeta
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async procesarWebhook(@Body() notificationData: any) {
    this.logger.log(`🔔 Webhook recibido de Mercado Pago`);
    
    try {
      const resultado = await this.pagoService.procesarNotificacionPago(notificationData);
      this.logger.log(`✅ Webhook procesado: ${resultado.status}`);
      return resultado;
    } catch (error) {
      this.logger.error(`❌ Error en webhook: ${error.message}`);
      throw error;
    }
  }

  @Get('health')
  async checkHealth() {
    this.logger.log(`🏥 Verificando estado de Mercado Pago`);
    
    try {
      const isConfigured = this.pagoService.isMercadoPagoConfigured();
      return {
        status: 'ok',
        mercadopago: {
          configured: isConfigured,
          message: isConfigured 
            ? 'Mercado Pago está configurado correctamente' 
            : 'Mercado Pago no está configurado. Se requieren credenciales válidas.'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`❌ Error en health check: ${error.message}`);
      return {
        status: 'error',
        mercadopago: {
          configured: false,
          message: `Error al verificar configuración: ${error.message}`
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Get()
  findAll() {
    return this.pagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
} 
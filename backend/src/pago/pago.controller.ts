import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
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

  // Endpoint de diagnóstico completo para los 3 problemas
  @Get('diagnostico')
  async diagnosticoCompleto() {
    try {
      console.log('🔍 === DIAGNÓSTICO COMPLETO INICIADO ===');
      
      // 1. DIAGNÓSTICO MERCADO PAGO
      console.log('1️⃣ DIAGNÓSTICO MERCADO PAGO:');
      const mercadopagoStatus = {
        variablesEntorno: {
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO',
          publicKey: process.env.MERCADOPAGO_PUBLIC_KEY ? 'CONFIGURADO' : 'NO CONFIGURADO',
        },
        configuracion: {
          isConfigured: this.pagoService.isMercadoPagoConfigured(),
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ? '***' + process.env.MERCADOPAGO_ACCESS_TOKEN.slice(-4) : 'NO HAY',
          publicKey: process.env.MERCADOPAGO_PUBLIC_KEY ? '***' + process.env.MERCADOPAGO_PUBLIC_KEY.slice(-4) : 'NO HAY',
        }
      };
      console.log('📊 Estado Mercado Pago:', mercadopagoStatus);

      // 2. DIAGNÓSTICO CUPOS
      console.log('2️⃣ DIAGNÓSTICO CUPOS:');
      const fechaTest = new Date();
      fechaTest.setDate(fechaTest.getDate() + 7); // 7 días en el futuro
      fechaTest.setHours(12, 0, 0, 0);
      
      const cuposStatus = {
        fechaTest: fechaTest.toISOString(),
        horarioTest: '18:00-20:00',
        tipoReserva: 'a-la-carta'
      };
      console.log('📊 Datos de prueba cupos:', cuposStatus);

      // 3. DIAGNÓSTICO FECHAS
      console.log('3️⃣ DIAGNÓSTICO FECHAS:');
      const fechaStatus = {
        fechaActual: new Date().toISOString(),
        fechaTest: fechaTest.toISOString(),
        formatoEsperado: 'YYYY-MM-DD'
      };
      console.log('📊 Datos de prueba fechas:', fechaStatus);

      console.log('🔍 === DIAGNÓSTICO COMPLETO FINALIZADO ===');

      return {
        timestamp: new Date().toISOString(),
        mercadopago: mercadopagoStatus,
        cupos: cuposStatus,
        fechas: fechaStatus,
        recomendaciones: [
          '1. Configurar MERCADOPAGO_ACCESS_TOKEN y MERCADOPAGO_PUBLIC_KEY para resolver problema de gift cards',
          '2. Verificar método calcularCapacidadCompartida para resolver problema de cupos',
          '3. Verificar normalización de fechas en backend para resolver problema de fechas'
        ]
      };
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      throw new BadRequestException(`Error en diagnóstico: ${error.message}`);
    }
  }

  // Endpoint de prueba específico para gift cards
  @Get('test-giftcard-mercadopago')
  async testGiftCardMercadoPago() {
    try {
      console.log('🧪 === TEST GIFT CARD MERCADO PAGO ===');
      
      // Simular datos de gift card
      const giftCardData = {
        nombreComprador: 'Test User',
        emailComprador: 'test@test.com',
        nombreDestinatario: 'Test Recipient',
        monto: 10000
      };
      
      console.log('📋 Datos de prueba:', giftCardData);
      
      // Verificar estado de Mercado Pago
      const mercadopagoStatus = {
        isConfigured: this.pagoService.isMercadoPagoConfigured(),
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ? '***' + process.env.MERCADOPAGO_ACCESS_TOKEN.slice(-4) : 'NO HAY',
        publicKey: process.env.MERCADOPAGO_PUBLIC_KEY ? '***' + process.env.MERCADOPAGO_PUBLIC_KEY.slice(-4) : 'NO HAY'
      };
      
      console.log('🔐 Estado Mercado Pago:', mercadopagoStatus);
      
      if (!mercadopagoStatus.isConfigured) {
        return {
          error: 'Mercado Pago no está configurado',
          mercadopagoStatus
        };
      }
      
      // Intentar crear preferencia real
      console.log('🚀 Intentando crear preferencia real...');
      const result = await this.pagoService.crearPreferenciaGiftCard(
        giftCardData,
        giftCardData.monto,
        'Gift Card Test'
      );
      
      console.log('✅ Resultado:', result);
      
      return {
        success: true,
        result,
        mercadopagoStatus
      };
      
    } catch (error) {
      console.error('❌ Error en test:', error);
      return {
        error: error.message,
        stack: error.stack,
        mercadopagoStatus: {
          isConfigured: this.pagoService.isMercadoPagoConfigured()
        }
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
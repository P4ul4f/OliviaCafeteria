import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  /**
   * Verificar estado de la configuración de WhatsApp
   */
  @Get('estado')
  async verificarEstado() {
    return this.whatsappService.verificarEstado();
  }

  /**
   * Webhook para manejar mensajes entrantes de WhatsApp (opcional)
   */
  @Post('webhook')
  async webhook(@Body() body: any) {
    this.logger.log('📱 Webhook WhatsApp recibido:', JSON.stringify(body, null, 2));
    
    // Procesar mensajes entrantes si es necesario
    // Por ahora solo registramos el webhook
    
    return { status: 'ok' };
  }

  /**
   * Endpoint de prueba para enviar mensaje manual (solo para testing)
   */
  @Post('test-mensaje')
  async testMensaje(@Body() body: { telefono: string; mensaje: string }) {
    try {
      const resultado = await this.whatsappService.enviarMensaje({
        to: body.telefono,
        type: 'text',
        text: {
          body: body.mensaje
        }
      });

      return {
        exito: resultado,
        mensaje: resultado ? 'Mensaje enviado' : 'Error al enviar mensaje'
      };
    } catch (error) {
      this.logger.error('❌ Error en test de mensaje:', error.message);
      return {
        exito: false,
        mensaje: `Error: ${error.message}`
      };
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

export interface WhatsAppMessage {
  to: string;
  type: 'template' | 'text';
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: any[];
  };
  text?: {
    body: string;
  };
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl: string;
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly isConfigured: boolean;

  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {
    // Configuración de WhatsApp Business API
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
    
    this.isConfigured = !!(this.accessToken && this.phoneNumberId);
    
    if (!this.isConfigured) {
      this.logger.warn('⚠️ WhatsApp Business API no está configurado. Configurar WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID');
    } else {
      this.logger.log('✅ WhatsApp Business API configurado correctamente');
    }
  }

  /**
   * Enviar mensaje de WhatsApp
   */
  async enviarMensaje(mensaje: WhatsAppMessage): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('❌ WhatsApp no configurado, simulando envío de mensaje');
      this.logger.log(`📱 SIMULADO - Mensaje a ${mensaje.to}: ${JSON.stringify(mensaje, null, 2)}`);
      return true;
    }

    try {
      this.logger.log(`📱 Enviando mensaje WhatsApp a ${mensaje.to}`);
      
      const response = await axios.post(
        this.apiUrl,
        mensaje,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`✅ Mensaje WhatsApp enviado exitosamente: ${response.data.messages[0].id}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error enviando mensaje WhatsApp: ${error.message}`);
      this.logger.error(`📱 Datos del mensaje: ${JSON.stringify(mensaje, null, 2)}`);
      
      // En caso de error, logear pero no fallar
      return false;
    }
  }

  /**
   * Enviar mensaje de confirmación de reserva
   */
  async enviarConfirmacionReserva(reserva: Reserva): Promise<boolean> {
    try {
      const telefono = this.formatearTelefono(reserva.telefono);
      const fechaFormateada = this.formatearFecha(reserva.fechaHora);
      const tipoReservaTexto = this.obtenerTipoReservaTexto(reserva.tipoReserva);

      const mensaje: WhatsAppMessage = {
        to: telefono,
        type: 'text',
        text: {
          body: `🎉 *¡Reserva Confirmada - Olivia Café!*\n\n` +
                `Hola ${reserva.nombreCliente}, tu reserva ha sido confirmada exitosamente.\n\n` +
                `📅 *Detalles de tu reserva:*\n` +
                `• Tipo: ${tipoReservaTexto}\n` +
                `• Fecha: ${fechaFormateada}\n` +
                `• Turno: ${reserva.turno}\n` +
                `• Personas: ${reserva.cantidadPersonas}\n` +
                `• Monto: $${reserva.montoTotal.toLocaleString('es-AR')}\n\n` +
                `📍 Te esperamos en Olivia Café\n` +
                `📞 Cualquier consulta: +54 9 11 1234-5678\n\n` +
                `¡Gracias por elegirnos! ☕️❤️`
        }
      };

      const enviado = await this.enviarMensaje(mensaje);
      
      if (enviado) {
        this.logger.log(`✅ Confirmación de reserva enviada a ${reserva.nombreCliente} (${telefono})`);
      }
      
      return enviado;
    } catch (error) {
      this.logger.error(`❌ Error enviando confirmación de reserva: ${error.message}`);
      return false;
    }
  }

  /**
   * Enviar mensaje de recordatorio 48 horas antes
   */
  async enviarRecordatorio48Horas(reserva: Reserva): Promise<boolean> {
    try {
      const telefono = this.formatearTelefono(reserva.telefono);
      const fechaFormateada = this.formatearFecha(reserva.fechaHora);
      const tipoReservaTexto = this.obtenerTipoReservaTexto(reserva.tipoReserva);

      const mensaje: WhatsAppMessage = {
        to: telefono,
        type: 'text',
        text: {
          body: `⏰ *Recordatorio - Olivia Café*\n\n` +
                `Hola ${reserva.nombreCliente}, te recordamos que tu reserva es en 48 horas.\n\n` +
                `📅 *Detalles de tu reserva:*\n` +
                `• Tipo: ${tipoReservaTexto}\n` +
                `• Fecha: ${fechaFormateada}\n` +
                `• Turno: ${reserva.turno}\n` +
                `• Personas: ${reserva.cantidadPersonas}\n\n` +
                `📍 Olivia Café te espera\n` +
                `📞 Cualquier cambio: +54 9 11 1234-5678\n\n` +
                `¡Nos vemos pronto! ☕️🥐`
        }
      };

      const enviado = await this.enviarMensaje(mensaje);
      
      if (enviado) {
        this.logger.log(`✅ Recordatorio 48h enviado a ${reserva.nombreCliente} (${telefono})`);
      }
      
      return enviado;
    } catch (error) {
      this.logger.error(`❌ Error enviando recordatorio 48h: ${error.message}`);
      return false;
    }
  }

  /**
   * Tarea programada para enviar recordatorios cada 6 horas
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async enviarRecordatoriosProgramados(): Promise<void> {
    try {
      this.logger.log('🔄 Iniciando envío de recordatorios programados...');
      
      // Calcular fecha dentro de 48 horas (con margen de 6 horas)
      const ahora = new Date();
      const inicio48h = new Date(ahora.getTime() + 42 * 60 * 60 * 1000); // 42 horas
      const fin48h = new Date(ahora.getTime() + 48 * 60 * 60 * 1000);   // 48 horas
      
      // Buscar reservas confirmadas dentro del rango
      const reservasParaRecordar = await this.reservaRepository
        .createQueryBuilder('reserva')
        .where('reserva.estado = :estado', { estado: 'CONFIRMADA' })
        .andWhere('reserva.fechaHora BETWEEN :inicio AND :fin', {
          inicio: inicio48h,
          fin: fin48h
        })
        .andWhere('reserva.recordatorio48hEnviado = :enviado', { enviado: false })
        .getMany();

      this.logger.log(`📱 Encontradas ${reservasParaRecordar.length} reservas para recordatorio 48h`);

      for (const reserva of reservasParaRecordar) {
        try {
          const enviado = await this.enviarRecordatorio48Horas(reserva);
          
          if (enviado) {
            // Marcar como enviado
            await this.reservaRepository.update(reserva.id, {
              recordatorio48hEnviado: true
            });
          }
        } catch (error) {
          this.logger.error(`❌ Error procesando recordatorio para reserva ${reserva.id}: ${error.message}`);
        }
      }

      this.logger.log('✅ Envío de recordatorios programados completado');
    } catch (error) {
      this.logger.error(`❌ Error en tarea de recordatorios programados: ${error.message}`);
    }
  }

  /**
   * Formatear número de teléfono para WhatsApp
   */
  private formatearTelefono(telefono: string): string {
    // Remover espacios, guiones y paréntesis
    let numeroLimpio = telefono.replace(/[\s\-\(\)]/g, '');
    
    // Si empieza con +54, mantenerlo
    if (numeroLimpio.startsWith('+54')) {
      return numeroLimpio;
    }
    
    // Si empieza con 54, agregar +
    if (numeroLimpio.startsWith('54')) {
      return `+${numeroLimpio}`;
    }
    
    // Si empieza con 0, removerlo y agregar +54
    if (numeroLimpio.startsWith('0')) {
      return `+54${numeroLimpio.substring(1)}`;
    }
    
    // Si es un número local, agregar +549 (para celulares)
    if (numeroLimpio.length === 10) {
      return `+549${numeroLimpio}`;
    }
    
    // Por defecto, agregar +54
    return `+54${numeroLimpio}`;
  }

  /**
   * Formatear fecha para mostrar en mensajes
   */
  private formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtener texto legible del tipo de reserva
   */
  private obtenerTipoReservaTexto(tipoReserva: string): string {
    switch (tipoReserva?.toLowerCase()) {
      case 'merienda_libre':
      case 'merienda-libre':
        return 'Merienda Libre';
      case 'tarde_te':
      case 'tarde-te':
        return 'Tarde de Té';
      case 'a_la_carta':
      case 'a-la-carta':
        return 'A la Carta';
      default:
        return tipoReserva || 'Reserva';
    }
  }

  /**
   * Verificar estado de la API de WhatsApp
   */
  async verificarEstado(): Promise<{ configurado: boolean; estado: string }> {
    if (!this.isConfigured) {
      return {
        configurado: false,
        estado: 'No configurado - faltan variables de entorno'
      };
    }

    try {
      // Hacer una petición de prueba para verificar la configuración
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      return {
        configurado: true,
        estado: `Configurado correctamente - ${response.data.display_phone_number}`
      };
    } catch (error) {
      return {
        configurado: false,
        estado: `Error de configuración: ${error.message}`
      };
    }
  }
}

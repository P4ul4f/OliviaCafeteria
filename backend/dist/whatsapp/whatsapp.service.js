"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserva_entity_1 = require("../reserva/reserva.entity");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("axios");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    reservaRepository;
    logger = new common_1.Logger(WhatsappService_1.name);
    apiUrl;
    accessToken;
    phoneNumberId;
    isConfigured;
    constructor(reservaRepository) {
        this.reservaRepository = reservaRepository;
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.apiUrl = this.phoneNumberId
            ? `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`
            : '';
        this.isConfigured = !!(this.accessToken && this.phoneNumberId);
        if (!this.isConfigured) {
            this.logger.warn('⚠️ WhatsApp Business API no está configurado. Configurar WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID');
        }
        else {
            this.logger.log('✅ WhatsApp Business API configurado correctamente');
        }
    }
    async enviarMensaje(mensaje) {
        if (!this.isConfigured) {
            this.logger.warn('❌ WhatsApp no configurado, simulando envío de mensaje');
            this.logger.log(`📱 SIMULADO - Mensaje a ${mensaje.to}: ${JSON.stringify(mensaje, null, 2)}`);
            return true;
        }
        try {
            this.logger.log(`📱 Enviando mensaje WhatsApp a ${mensaje.to}`);
            const response = await axios_1.default.post(this.apiUrl, mensaje, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.log(`✅ Mensaje WhatsApp enviado exitosamente: ${response.data.messages[0].id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Error enviando mensaje WhatsApp: ${error.message}`);
            this.logger.error(`📱 Datos del mensaje: ${JSON.stringify(mensaje, null, 2)}`);
            return false;
        }
    }
    async enviarConfirmacionReserva(reserva) {
        try {
            const telefono = this.formatearTelefono(reserva.telefono);
            const fechaFormateada = this.formatearFecha(reserva.fechaHora);
            const tipoReservaTexto = this.obtenerTipoReservaTexto(reserva.tipoReserva);
            const mensaje = {
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
        }
        catch (error) {
            this.logger.error(`❌ Error enviando confirmación de reserva: ${error.message}`);
            return false;
        }
    }
    async enviarRecordatorio48Horas(reserva) {
        try {
            const telefono = this.formatearTelefono(reserva.telefono);
            const fechaFormateada = this.formatearFecha(reserva.fechaHora);
            const tipoReservaTexto = this.obtenerTipoReservaTexto(reserva.tipoReserva);
            const mensaje = {
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
        }
        catch (error) {
            this.logger.error(`❌ Error enviando recordatorio 48h: ${error.message}`);
            return false;
        }
    }
    async enviarRecordatoriosProgramados() {
        try {
            this.logger.log('🔄 Iniciando envío de recordatorios programados...');
            const ahora = new Date();
            const inicio48h = new Date(ahora.getTime() + 42 * 60 * 60 * 1000);
            const fin48h = new Date(ahora.getTime() + 48 * 60 * 60 * 1000);
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
                        await this.reservaRepository.update(reserva.id, {
                            recordatorio48hEnviado: true
                        });
                    }
                }
                catch (error) {
                    this.logger.error(`❌ Error procesando recordatorio para reserva ${reserva.id}: ${error.message}`);
                }
            }
            this.logger.log('✅ Envío de recordatorios programados completado');
        }
        catch (error) {
            this.logger.error(`❌ Error en tarea de recordatorios programados: ${error.message}`);
        }
    }
    formatearTelefono(telefono) {
        let numeroLimpio = telefono.replace(/[\s\-\(\)]/g, '');
        if (numeroLimpio.startsWith('+54')) {
            return numeroLimpio;
        }
        if (numeroLimpio.startsWith('54')) {
            return `+${numeroLimpio}`;
        }
        if (numeroLimpio.startsWith('0')) {
            return `+54${numeroLimpio.substring(1)}`;
        }
        if (numeroLimpio.length === 10) {
            return `+549${numeroLimpio}`;
        }
        return `+54${numeroLimpio}`;
    }
    formatearFecha(fecha) {
        return fecha.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    obtenerTipoReservaTexto(tipoReserva) {
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
    async verificarEstado() {
        if (!this.isConfigured) {
            return {
                configurado: false,
                estado: 'No configurado - faltan variables de entorno'
            };
        }
        try {
            const response = await axios_1.default.get(`https://graph.facebook.com/v18.0/${this.phoneNumberId}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                },
            });
            return {
                configurado: true,
                estado: `Configurado correctamente - ${response.data.display_phone_number}`
            };
        }
        catch (error) {
            return {
                configurado: false,
                estado: `Error de configuración: ${error.message}`
            };
        }
    }
};
exports.WhatsappService = WhatsappService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_6_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WhatsappService.prototype, "enviarRecordatoriosProgramados", null);
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map
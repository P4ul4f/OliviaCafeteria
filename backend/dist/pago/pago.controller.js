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
var PagoController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagoController = void 0;
const common_1 = require("@nestjs/common");
const pago_service_1 = require("./pago.service");
const create_pago_dto_1 = require("./dto/create-pago.dto");
const update_pago_dto_1 = require("./dto/update-pago.dto");
let PagoController = PagoController_1 = class PagoController {
    pagoService;
    logger = new common_1.Logger(PagoController_1.name);
    constructor(pagoService) {
        this.pagoService = pagoService;
    }
    async crearPreferencia(body) {
        this.logger.log(`📝 Creando preferencia para: ${body.reservaData?.nombre}`);
        return this.pagoService.crearPreferenciaMercadoPago(body.reservaData, body.monto, body.descripcion);
    }
    async crearPreferenciaGiftCard(body) {
        this.logger.log(`📝 Creando preferencia GiftCard para: ${body.giftCardData?.nombreComprador}`);
        return this.pagoService.crearPreferenciaGiftCard(body.giftCardData, body.monto, body.descripcion);
    }
    async pagarConTarjeta(body) {
        this.logger.log(`💳 Solicitud de pago con tarjeta para: ${body.reservaData?.nombre}`);
        const { reservaData, total, descripcion, datosLarjeta } = body;
        if (!reservaData || !total || !descripcion || !datosLarjeta) {
            throw new Error('Datos incompletos para el pago con tarjeta');
        }
        return this.pagoService.procesarPagoTarjeta(reservaData, total, descripcion, datosLarjeta);
    }
    async pagarGiftCardConTarjeta(body) {
        this.logger.log(`💳 Solicitud de pago GiftCard con tarjeta para: ${body.giftCardData?.nombreComprador}`);
        const { giftCardData, total, descripcion, datosLarjeta } = body;
        if (!giftCardData || !total || !descripcion || !datosLarjeta) {
            throw new Error('Datos incompletos para el pago de GiftCard con tarjeta');
        }
        return this.pagoService.procesarPagoTarjetaGiftCard(giftCardData, total, descripcion, datosLarjeta);
    }
    async procesarWebhook(notificationData) {
        this.logger.log(`🔔 Webhook recibido de Mercado Pago`);
        try {
            const resultado = await this.pagoService.procesarNotificacionPago(notificationData);
            this.logger.log(`✅ Webhook procesado: ${resultado.status}`);
            return resultado;
        }
        catch (error) {
            this.logger.error(`❌ Error en webhook: ${error.message}`);
            throw error;
        }
    }
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
        }
        catch (error) {
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
    async diagnosticoCompleto() {
        try {
            console.log('🔍 === DIAGNÓSTICO COMPLETO INICIADO ===');
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
            console.log('2️⃣ DIAGNÓSTICO CUPOS:');
            const fechaTest = new Date();
            fechaTest.setDate(fechaTest.getDate() + 7);
            fechaTest.setHours(12, 0, 0, 0);
            const cuposStatus = {
                fechaTest: fechaTest.toISOString(),
                horarioTest: '18:00-20:00',
                tipoReserva: 'a-la-carta'
            };
            console.log('📊 Datos de prueba cupos:', cuposStatus);
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
        }
        catch (error) {
            console.error('❌ Error en diagnóstico:', error);
            throw new common_1.BadRequestException(`Error en diagnóstico: ${error.message}`);
        }
    }
    async testGiftCardMercadoPago() {
        try {
            console.log('🧪 === TEST GIFT CARD MERCADO PAGO ===');
            const giftCardData = {
                nombreComprador: 'Test User',
                emailComprador: 'test@test.com',
                nombreDestinatario: 'Test Recipient',
                monto: 10000
            };
            console.log('📋 Datos de prueba:', giftCardData);
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
            console.log('🚀 Intentando crear preferencia real...');
            const result = await this.pagoService.crearPreferenciaGiftCard(giftCardData, giftCardData.monto, 'Gift Card Test');
            console.log('✅ Resultado:', result);
            return {
                success: true,
                result,
                mercadopagoStatus
            };
        }
        catch (error) {
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
    create(createPagoDto) {
        return this.pagoService.create(createPagoDto);
    }
    findAll() {
        return this.pagoService.findAll();
    }
    findOne(id) {
        return this.pagoService.findOne(+id);
    }
    update(id, updatePagoDto) {
        return this.pagoService.update(+id, updatePagoDto);
    }
    remove(id) {
        return this.pagoService.remove(+id);
    }
};
exports.PagoController = PagoController;
__decorate([
    (0, common_1.Post)('crear-preferencia'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "crearPreferencia", null);
__decorate([
    (0, common_1.Post)('crear-preferencia-giftcard'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "crearPreferenciaGiftCard", null);
__decorate([
    (0, common_1.Post)('pagar-con-tarjeta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "pagarConTarjeta", null);
__decorate([
    (0, common_1.Post)('pagar-giftcard-con-tarjeta'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "pagarGiftCardConTarjeta", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "procesarWebhook", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Get)('diagnostico'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "diagnosticoCompleto", null);
__decorate([
    (0, common_1.Get)('test-giftcard-mercadopago'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PagoController.prototype, "testGiftCardMercadoPago", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pago_dto_1.CreatePagoDto]),
    __metadata("design:returntype", void 0)
], PagoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PagoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pago_dto_1.UpdatePagoDto]),
    __metadata("design:returntype", void 0)
], PagoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagoController.prototype, "remove", null);
exports.PagoController = PagoController = PagoController_1 = __decorate([
    (0, common_1.Controller)('pago'),
    __metadata("design:paramtypes", [pago_service_1.PagoService])
], PagoController);
//# sourceMappingURL=pago.controller.js.map
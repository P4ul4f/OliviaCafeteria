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
var WhatsappController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
let WhatsappController = WhatsappController_1 = class WhatsappController {
    whatsappService;
    logger = new common_1.Logger(WhatsappController_1.name);
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async verificarEstado() {
        return this.whatsappService.verificarEstado();
    }
    async webhook(body) {
        this.logger.log('📱 Webhook WhatsApp recibido:', JSON.stringify(body, null, 2));
        return { status: 'ok' };
    }
    async testMensaje(body) {
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
        }
        catch (error) {
            this.logger.error('❌ Error en test de mensaje:', error.message);
            return {
                exito: false,
                mensaje: `Error: ${error.message}`
            };
        }
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Get)('estado'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "verificarEstado", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "webhook", null);
__decorate([
    (0, common_1.Post)('test-mensaje'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "testMensaje", null);
exports.WhatsappController = WhatsappController = WhatsappController_1 = __decorate([
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map
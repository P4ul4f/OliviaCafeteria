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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftCardController = void 0;
const common_1 = require("@nestjs/common");
const giftcard_service_1 = require("./giftcard.service");
const create_giftcard_dto_1 = require("./dto/create-giftcard.dto");
let GiftCardController = class GiftCardController {
    giftCardService;
    constructor(giftCardService) {
        this.giftCardService = giftCardService;
    }
    async createConPago(dto) {
        return this.giftCardService.createConPago(dto);
    }
    async findAll() {
        return this.giftCardService.findAll();
    }
    async findOne(id) {
        return this.giftCardService.findOne(+id);
    }
    async update(id, dto) {
        return this.giftCardService.update(+id, dto);
    }
    async remove(id) {
        return this.giftCardService.remove(+id);
    }
    async confirmarPago(id, data) {
        return this.giftCardService.confirmarPago(+id, data.idPagoExterno, data.metodoPago);
    }
    async enviarGiftCard(id) {
        return this.giftCardService.enviarGiftCard(+id);
    }
};
exports.GiftCardController = GiftCardController;
__decorate([
    (0, common_1.Post)('crear-con-pago'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_giftcard_dto_1.CreateGiftCardConPagoDto]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "createConPago", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/confirmar-pago'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "confirmarPago", null);
__decorate([
    (0, common_1.Patch)(':id/enviar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftCardController.prototype, "enviarGiftCard", null);
exports.GiftCardController = GiftCardController = __decorate([
    (0, common_1.Controller)('giftcard'),
    __metadata("design:paramtypes", [giftcard_service_1.GiftCardService])
], GiftCardController);
//# sourceMappingURL=giftcard.controller.js.map
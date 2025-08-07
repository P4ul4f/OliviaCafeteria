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
exports.GiftCardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const giftcard_entity_1 = require("./giftcard.entity");
let GiftCardService = class GiftCardService {
    giftCardRepository;
    constructor(giftCardRepository) {
        this.giftCardRepository = giftCardRepository;
    }
    async createConPago(dto) {
        const giftCard = this.giftCardRepository.create({
            ...dto,
            estado: giftcard_entity_1.EstadoGiftCard.PAGADA,
        });
        return this.giftCardRepository.save(giftCard);
    }
    async findAll() {
        return this.giftCardRepository.find({
            order: { fechaCreacion: 'DESC' },
        });
    }
    async findOne(id) {
        return this.giftCardRepository.findOne({ where: { id } });
    }
    async update(id, dto) {
        const giftCard = await this.findOne(id);
        if (giftCard) {
            Object.assign(giftCard, dto);
            return this.giftCardRepository.save(giftCard);
        }
        return null;
    }
    async remove(id) {
        const result = await this.giftCardRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async confirmarPago(id, idPagoExterno, metodoPago) {
        const giftCard = await this.findOne(id);
        if (!giftCard) {
            throw new common_1.BadRequestException('Gift Card no encontrada');
        }
        giftCard.estado = giftcard_entity_1.EstadoGiftCard.PAGADA;
        giftCard.idPagoExterno = idPagoExterno;
        giftCard.metodoPago = metodoPago;
        return this.giftCardRepository.save(giftCard);
    }
    async enviarGiftCard(id) {
        const giftCard = await this.findOne(id);
        if (!giftCard) {
            throw new common_1.BadRequestException('Gift Card no encontrada');
        }
        if (giftCard.estado !== giftcard_entity_1.EstadoGiftCard.PAGADA) {
            throw new common_1.BadRequestException('La Gift Card debe estar pagada para ser enviada');
        }
        giftCard.estado = giftcard_entity_1.EstadoGiftCard.ENVIADA;
        return this.giftCardRepository.save(giftCard);
    }
};
exports.GiftCardService = GiftCardService;
exports.GiftCardService = GiftCardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(giftcard_entity_1.GiftCard)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GiftCardService);
//# sourceMappingURL=giftcard.service.js.map
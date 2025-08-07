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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftCard = exports.EstadoGiftCard = void 0;
const typeorm_1 = require("typeorm");
var EstadoGiftCard;
(function (EstadoGiftCard) {
    EstadoGiftCard["PAGADA"] = "PAGADA";
    EstadoGiftCard["ENVIADA"] = "ENVIADA";
    EstadoGiftCard["CANCELADA"] = "CANCELADA";
})(EstadoGiftCard || (exports.EstadoGiftCard = EstadoGiftCard = {}));
let GiftCard = class GiftCard {
    id;
    nombreComprador;
    telefonoComprador;
    emailComprador;
    nombreDestinatario;
    telefonoDestinatario;
    monto;
    mensaje;
    estado;
    idPagoExterno;
    metodoPago;
    fechaCreacion;
    fechaActualizacion;
};
exports.GiftCard = GiftCard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GiftCard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GiftCard.prototype, "nombreComprador", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GiftCard.prototype, "telefonoComprador", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GiftCard.prototype, "emailComprador", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GiftCard.prototype, "nombreDestinatario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GiftCard.prototype, "telefonoDestinatario", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], GiftCard.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GiftCard.prototype, "mensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoGiftCard,
        default: EstadoGiftCard.PAGADA,
    }),
    __metadata("design:type", String)
], GiftCard.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GiftCard.prototype, "idPagoExterno", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GiftCard.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GiftCard.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GiftCard.prototype, "fechaActualizacion", void 0);
exports.GiftCard = GiftCard = __decorate([
    (0, typeorm_1.Entity)()
], GiftCard);
//# sourceMappingURL=giftcard.entity.js.map
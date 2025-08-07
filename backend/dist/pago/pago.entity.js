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
exports.Pago = exports.EstadoPago = exports.MetodoPago = void 0;
const typeorm_1 = require("typeorm");
const reserva_entity_1 = require("../reserva/reserva.entity");
const giftcard_entity_1 = require("../giftcard/giftcard.entity");
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["TARJETA"] = "tarjeta";
    MetodoPago["TRANSFERENCIA"] = "transferencia";
    MetodoPago["MERCADO_PAGO"] = "mercado pago";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
var EstadoPago;
(function (EstadoPago) {
    EstadoPago["PENDIENTE"] = "PENDIENTE";
    EstadoPago["APROBADO"] = "APROBADO";
    EstadoPago["EN_PROCESO"] = "EN_PROCESO";
    EstadoPago["RECHAZADO"] = "RECHAZADO";
    EstadoPago["CANCELADO"] = "CANCELADO";
})(EstadoPago || (exports.EstadoPago = EstadoPago = {}));
let Pago = class Pago {
    id;
    reservaId;
    giftCardId;
    monto;
    fechaPago;
    metodo;
    estado;
    idPagoExterno;
    datosPago;
    reserva;
    giftCard;
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pago.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pago.prototype, "reservaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Pago.prototype, "giftCardId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pago.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Pago.prototype, "fechaPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetodoPago
    }),
    __metadata("design:type", String)
], Pago.prototype, "metodo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoPago,
        default: EstadoPago.PENDIENTE
    }),
    __metadata("design:type", String)
], Pago.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "idPagoExterno", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "datosPago", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reserva_entity_1.Reserva, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reservaId' }),
    __metadata("design:type", reserva_entity_1.Reserva)
], Pago.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => giftcard_entity_1.GiftCard, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'giftCardId' }),
    __metadata("design:type", giftcard_entity_1.GiftCard)
], Pago.prototype, "giftCard", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)()
], Pago);
//# sourceMappingURL=pago.entity.js.map
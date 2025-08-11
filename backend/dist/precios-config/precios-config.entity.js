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
exports.PreciosConfig = void 0;
const typeorm_1 = require("typeorm");
let PreciosConfig = class PreciosConfig {
    id;
    clave;
    promoOlivia;
    promoBasica;
    meriendaLibre;
    aLaCarta;
    tardeDeTe;
    descripcionPromoOlivia;
    descripcionPromoBasica;
    cuposMeriendasLibres;
    cuposTardesDeTe;
    capacidadMaximaCompartida;
    createdAt;
    updatedAt;
};
exports.PreciosConfig = PreciosConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], PreciosConfig.prototype, "clave", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "promoOlivia", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "promoBasica", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "meriendaLibre", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 5000 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "aLaCarta", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "tardeDeTe", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PreciosConfig.prototype, "descripcionPromoOlivia", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PreciosConfig.prototype, "descripcionPromoBasica", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { default: 40 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "cuposMeriendasLibres", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { default: 5 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "cuposTardesDeTe", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { default: 65 }),
    __metadata("design:type", Number)
], PreciosConfig.prototype, "capacidadMaximaCompartida", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], PreciosConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt' }),
    __metadata("design:type", Date)
], PreciosConfig.prototype, "updatedAt", void 0);
exports.PreciosConfig = PreciosConfig = __decorate([
    (0, typeorm_1.Entity)()
], PreciosConfig);
//# sourceMappingURL=precios-config.entity.js.map
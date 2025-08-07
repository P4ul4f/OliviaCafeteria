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
exports.CreateGiftCardConPagoDto = exports.CreateGiftCardDto = void 0;
const class_validator_1 = require("class-validator");
class CreateGiftCardDto {
    nombreComprador;
    telefonoComprador;
    emailComprador;
    nombreDestinatario;
    telefonoDestinatario;
    monto;
    mensaje;
}
exports.CreateGiftCardDto = CreateGiftCardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGiftCardDto.prototype, "nombreComprador", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGiftCardDto.prototype, "telefonoComprador", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateGiftCardDto.prototype, "emailComprador", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGiftCardDto.prototype, "nombreDestinatario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGiftCardDto.prototype, "telefonoDestinatario", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateGiftCardDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGiftCardDto.prototype, "mensaje", void 0);
class CreateGiftCardConPagoDto extends CreateGiftCardDto {
    idPagoExterno;
    metodoPago;
}
exports.CreateGiftCardConPagoDto = CreateGiftCardConPagoDto;
//# sourceMappingURL=create-giftcard.dto.js.map
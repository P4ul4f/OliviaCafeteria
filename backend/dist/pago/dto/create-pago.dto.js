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
exports.CreatePagoDto = void 0;
const class_validator_1 = require("class-validator");
const pago_entity_1 = require("../pago.entity");
class CreatePagoDto {
    reservaId;
    monto;
    metodo;
    idPagoExterno;
    estado;
    fechaPago;
    datosPago;
}
exports.CreatePagoDto = CreatePagoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de reserva es obligatorio' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de reserva debe ser un número' }),
    __metadata("design:type", Number)
], CreatePagoDto.prototype, "reservaId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El monto es obligatorio' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El monto debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El monto no puede ser negativo' }),
    __metadata("design:type", Number)
], CreatePagoDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El método de pago es obligatorio' }),
    (0, class_validator_1.IsEnum)(pago_entity_1.MetodoPago, { message: 'Método de pago no válido' }),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "metodo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID de pago externo debe ser texto' }),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "idPagoExterno", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(pago_entity_1.EstadoPago, { message: 'Estado de pago no válido' }),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de pago debe tener formato válido' }),
    __metadata("design:type", Date)
], CreatePagoDto.prototype, "fechaPago", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Los datos de pago deben ser texto' }),
    __metadata("design:type", String)
], CreatePagoDto.prototype, "datosPago", void 0);
//# sourceMappingURL=create-pago.dto.js.map
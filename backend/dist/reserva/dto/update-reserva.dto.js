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
exports.UpdateReservaDto = void 0;
const reserva_entity_1 = require("../reserva.entity");
const class_validator_1 = require("class-validator");
class UpdateReservaDto {
    fechaHora;
    nombreCliente;
    telefono;
    montoSenia;
    cantidadPersonas;
    estado;
}
exports.UpdateReservaDto = UpdateReservaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(reserva_entity_1.EstadoReserva, { message: 'El estado debe ser PENDIENTE, CONFIRMADA o CANCELADA' }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "estado", void 0);
//# sourceMappingURL=update-reserva.dto.js.map
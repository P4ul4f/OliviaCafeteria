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
exports.CheckAvailabilityDto = void 0;
const class_validator_1 = require("class-validator");
const reserva_entity_1 = require("../reserva.entity");
class CheckAvailabilityDto {
    fecha;
    turno;
    tipoReserva;
    cantidadPersonas;
}
exports.CheckAvailabilityDto = CheckAvailabilityDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha es obligatoria' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe ser válida' }),
    __metadata("design:type", Date)
], CheckAvailabilityDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El turno es obligatorio' }),
    (0, class_validator_1.IsString)({ message: 'El turno debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "turno", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de reserva es obligatorio' }),
    (0, class_validator_1.IsEnum)(reserva_entity_1.TipoReserva, { message: 'El tipo de reserva debe ser merienda-libre o tarde-te' }),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "tipoReserva", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La cantidad de personas es obligatoria' }),
    (0, class_validator_1.IsNumber)({}, { message: 'La cantidad de personas debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'La cantidad mínima es 1 persona' }),
    (0, class_validator_1.Max)(30, { message: 'La cantidad máxima es 30 personas' }),
    __metadata("design:type", Number)
], CheckAvailabilityDto.prototype, "cantidadPersonas", void 0);
//# sourceMappingURL=check-availability.dto.js.map
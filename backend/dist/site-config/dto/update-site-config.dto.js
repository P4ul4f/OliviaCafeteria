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
exports.UpdateSiteConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class HorarioDto {
    abierto;
    manana;
    noche;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], HorarioDto.prototype, "abierto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HorarioDto.prototype, "manana", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HorarioDto.prototype, "noche", void 0);
class HorariosDto {
    lunes;
    martes;
    miercoles;
    jueves;
    viernes;
    sabado;
    domingo;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "lunes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "martes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "miercoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "jueves", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "viernes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "sabado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorarioDto),
    __metadata("design:type", HorarioDto)
], HorariosDto.prototype, "domingo", void 0);
class UpdateSiteConfigDto {
    telefono;
    direccion;
    email;
    horarios;
}
exports.UpdateSiteConfigDto = UpdateSiteConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSiteConfigDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSiteConfigDto.prototype, "direccion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSiteConfigDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HorariosDto),
    __metadata("design:type", HorariosDto)
], UpdateSiteConfigDto.prototype, "horarios", void 0);
//# sourceMappingURL=update-site-config.dto.js.map
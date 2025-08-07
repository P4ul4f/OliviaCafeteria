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
exports.CreateAdministradorDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAdministradorDto {
    usuario;
    contrasena;
}
exports.CreateAdministradorDto = CreateAdministradorDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El usuario es obligatorio' }),
    (0, class_validator_1.IsString)({ message: 'El usuario debe ser texto' }),
    (0, class_validator_1.Length)(3, 50, { message: 'El usuario debe tener entre 3 y 50 caracteres' }),
    __metadata("design:type", String)
], CreateAdministradorDto.prototype, "usuario", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser texto' }),
    (0, class_validator_1.Length)(8, 128, { message: 'La contraseña debe tener entre 8 y 128 caracteres' }),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    }, {
        message: 'La contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula y un número',
    }),
    __metadata("design:type", String)
], CreateAdministradorDto.prototype, "contrasena", void 0);
//# sourceMappingURL=create-administrador.dto.js.map
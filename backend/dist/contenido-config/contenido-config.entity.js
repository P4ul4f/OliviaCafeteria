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
exports.ContenidoConfig = void 0;
const typeorm_1 = require("typeorm");
let ContenidoConfig = class ContenidoConfig {
    id;
    clave;
    contenido;
    descripcion;
    fechaCreacion;
    fechaActualizacion;
};
exports.ContenidoConfig = ContenidoConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContenidoConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContenidoConfig.prototype, "clave", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ContenidoConfig.prototype, "contenido", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContenidoConfig.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fechaCreacion' }),
    __metadata("design:type", Date)
], ContenidoConfig.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'fechaActualizacion' }),
    __metadata("design:type", Date)
], ContenidoConfig.prototype, "fechaActualizacion", void 0);
exports.ContenidoConfig = ContenidoConfig = __decorate([
    (0, typeorm_1.Entity)()
], ContenidoConfig);
//# sourceMappingURL=contenido-config.entity.js.map
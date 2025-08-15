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
exports.FechasConfig = void 0;
const typeorm_1 = require("typeorm");
let FechasConfig = class FechasConfig {
    id;
    fecha;
    tipoReserva;
    turnosDisponibles;
    cupos;
    activo;
    observaciones;
    createdAt;
    updatedAt;
};
exports.FechasConfig = FechasConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FechasConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        comment: 'Fecha de la configuración'
    }),
    __metadata("design:type", Date)
], FechasConfig.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        comment: 'Tipo de reserva (merienda-libre, tarde-te, a-la-carta)'
    }),
    __metadata("design:type", String)
], FechasConfig.prototype, "tipoReserva", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Turnos disponibles con horarios y cupos'
    }),
    __metadata("design:type", Object)
], FechasConfig.prototype, "turnosDisponibles", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
        comment: 'Cupos totales disponibles'
    }),
    __metadata("design:type", Number)
], FechasConfig.prototype, "cupos", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
        comment: 'Indica si la fecha está activa'
    }),
    __metadata("design:type", Boolean)
], FechasConfig.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        comment: 'Observaciones adicionales'
    }),
    __metadata("design:type", String)
], FechasConfig.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FechasConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FechasConfig.prototype, "updatedAt", void 0);
exports.FechasConfig = FechasConfig = __decorate([
    (0, typeorm_1.Entity)('fechas_config')
], FechasConfig);
//# sourceMappingURL=fechas-config.entity.js.map
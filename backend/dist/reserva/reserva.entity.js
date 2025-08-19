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
exports.Reserva = exports.EstadoPago = exports.TipoReserva = exports.EstadoReserva = void 0;
const typeorm_1 = require("typeorm");
var EstadoReserva;
(function (EstadoReserva) {
    EstadoReserva["PENDIENTE"] = "PENDIENTE";
    EstadoReserva["CONFIRMADA"] = "CONFIRMADA";
    EstadoReserva["CANCELADA"] = "CANCELADA";
})(EstadoReserva || (exports.EstadoReserva = EstadoReserva = {}));
var TipoReserva;
(function (TipoReserva) {
    TipoReserva["A_LA_CARTA"] = "a-la-carta";
    TipoReserva["MERIENDA_LIBRE"] = "merienda-libre";
    TipoReserva["TARDE_TE"] = "tarde-te";
})(TipoReserva || (exports.TipoReserva = TipoReserva = {}));
var EstadoPago;
(function (EstadoPago) {
    EstadoPago["PENDIENTE"] = "PENDIENTE";
    EstadoPago["PAGADO"] = "PAGADO";
    EstadoPago["RECHAZADO"] = "RECHAZADO";
})(EstadoPago || (exports.EstadoPago = EstadoPago = {}));
let Reserva = class Reserva {
    id;
    nombreCliente;
    telefono;
    fechaHora;
    turno;
    cantidadPersonas;
    tipoReserva;
    montoTotal;
    montoSenia;
    estado;
    estadoPago;
    fechaCreacion;
    idPagoExterno;
    metodoPago;
    recordatorio48hEnviado;
};
exports.Reserva = Reserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reserva.prototype, "nombreCliente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reserva.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Reserva.prototype, "fechaHora", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reserva.prototype, "turno", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Reserva.prototype, "cantidadPersonas", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoReserva
    }),
    __metadata("design:type", String)
], Reserva.prototype, "tipoReserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Reserva.prototype, "montoTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reserva.prototype, "montoSenia", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoReserva,
        default: EstadoReserva.PENDIENTE
    }),
    __metadata("design:type", String)
], Reserva.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoPago,
        default: EstadoPago.PENDIENTE
    }),
    __metadata("design:type", String)
], Reserva.prototype, "estadoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Reserva.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "idPagoExterno", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Reserva.prototype, "recordatorio48hEnviado", void 0);
exports.Reserva = Reserva = __decorate([
    (0, typeorm_1.Entity)()
], Reserva);
//# sourceMappingURL=reserva.entity.js.map
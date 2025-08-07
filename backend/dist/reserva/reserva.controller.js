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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaController = void 0;
const common_1 = require("@nestjs/common");
const reserva_service_1 = require("./reserva.service");
const update_reserva_dto_1 = require("./dto/update-reserva.dto");
const check_availability_dto_1 = require("./dto/check-availability.dto");
const reserva_entity_1 = require("./reserva.entity");
const create_reserva_dto_1 = require("./dto/create-reserva.dto");
let ReservaController = class ReservaController {
    reservaService;
    constructor(reservaService) {
        this.reservaService = reservaService;
    }
    testDatabase() {
        return {
            message: 'Conexión a la base de datos exitosa!',
            timestamp: new Date().toISOString(),
            status: 'OK'
        };
    }
    testHorarios() {
        return {
            message: 'Endpoint de horarios funcionando',
            horarios: ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
            timestamp: new Date().toISOString()
        };
    }
    getHorariosSimple() {
        try {
            const horarios = [];
            for (let hora = 9; hora <= 12; hora++) {
                for (let minuto = 0; minuto < 60; minuto += 30) {
                    if (hora === 12 && minuto === 30)
                        break;
                    const horaStr = hora.toString().padStart(2, '0');
                    const minutoStr = minuto.toString().padStart(2, '0');
                    horarios.push(`${horaStr}:${minutoStr}`);
                }
            }
            return {
                success: true,
                horarios,
                message: 'Horarios generados directamente'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error en endpoint simple'
            };
        }
    }
    createConPago(dto) {
        return this.reservaService.createConPago(dto);
    }
    checkAvailability(dto) {
        return this.reservaService.checkAvailability(dto);
    }
    getFechasDisponibles(tipoReserva) {
        return this.reservaService.getFechasDisponibles(tipoReserva);
    }
    getFechasDisponiblesConCupos(tipoReserva) {
        return this.reservaService.getFechasDisponiblesConCupos(tipoReserva);
    }
    getHorariosDisponibles(fecha, tipoReservaString) {
        try {
            console.log('📅 Fecha recibida:', fecha);
            console.log('🎯 Tipo de reserva recibido:', tipoReservaString);
            const tipoReserva = tipoReservaString;
            if (!Object.values(reserva_entity_1.TipoReserva).includes(tipoReserva)) {
                throw new Error(`Tipo de reserva inválido: ${tipoReservaString}`);
            }
            console.log('✅ Tipo de reserva validado:', tipoReserva);
            let fechaObj;
            if (fecha.includes('GMT')) {
                fechaObj = new Date(fecha);
            }
            else {
                fechaObj = new Date(fecha);
            }
            if (isNaN(fechaObj.getTime())) {
                throw new Error('Fecha inválida');
            }
            console.log('✅ Fecha parseada:', fechaObj.toISOString());
            return this.reservaService.getHorariosDisponibles(fechaObj, tipoReserva);
        }
        catch (error) {
            console.error('❌ Error al procesar horarios disponibles:', error);
            throw new common_1.BadRequestException(`Error al procesar la solicitud: ${error.message}`);
        }
    }
    getHorariosDisponiblesConCupos(fecha, tipoReservaString) {
        try {
            console.log('📅 Fecha recibida (con cupos):', fecha);
            console.log('🎯 Tipo de reserva recibido (con cupos):', tipoReservaString);
            const tipoReserva = tipoReservaString;
            if (!Object.values(reserva_entity_1.TipoReserva).includes(tipoReserva)) {
                throw new Error(`Tipo de reserva inválido: ${tipoReservaString}`);
            }
            console.log('✅ Tipo de reserva validado (con cupos):', tipoReserva);
            let fechaObj;
            if (fecha.includes('GMT')) {
                fechaObj = new Date(fecha);
            }
            else {
                fechaObj = new Date(fecha);
            }
            if (isNaN(fechaObj.getTime())) {
                throw new Error('Fecha inválida');
            }
            console.log('✅ Fecha parseada (con cupos):', fechaObj.toISOString());
            return this.reservaService.getHorariosDisponiblesConCupos(fechaObj, tipoReserva);
        }
        catch (error) {
            console.error('❌ Error al procesar horarios disponibles con cupos:', error);
            throw new common_1.BadRequestException(`Error al procesar la solicitud: ${error.message}`);
        }
    }
    confirmarPago(id, body) {
        return this.reservaService.confirmarPago(Number(id), body.idPagoExterno, body.metodoPago);
    }
    findAll() {
        return this.reservaService.findAll();
    }
    findOne(id) {
        return this.reservaService.findOne(Number(id));
    }
    update(id, dto) {
        return this.reservaService.update(Number(id), dto);
    }
    remove(id) {
        return this.reservaService.remove(Number(id));
    }
};
exports.ReservaController = ReservaController;
__decorate([
    (0, common_1.Get)('test-db'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "testDatabase", null);
__decorate([
    (0, common_1.Get)('test-horarios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "testHorarios", null);
__decorate([
    (0, common_1.Get)('horarios-simple'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "getHorariosSimple", null);
__decorate([
    (0, common_1.Post)('crear-con-pago'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reserva_dto_1.CreateReservaConPagoDto]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "createConPago", null);
__decorate([
    (0, common_1.Post)('check-availability'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_availability_dto_1.CheckAvailabilityDto]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)('fechas-disponibles/:tipoReserva'),
    __param(0, (0, common_1.Param)('tipoReserva')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "getFechasDisponibles", null);
__decorate([
    (0, common_1.Get)('fechas-disponibles-con-cupos/:tipoReserva'),
    __param(0, (0, common_1.Param)('tipoReserva')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "getFechasDisponiblesConCupos", null);
__decorate([
    (0, common_1.Get)('horarios-disponibles'),
    __param(0, (0, common_1.Query)('fecha')),
    __param(1, (0, common_1.Query)('tipoReserva')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "getHorariosDisponibles", null);
__decorate([
    (0, common_1.Get)('horarios-disponibles-con-cupos'),
    __param(0, (0, common_1.Query)('fecha')),
    __param(1, (0, common_1.Query)('tipoReserva')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "getHorariosDisponiblesConCupos", null);
__decorate([
    (0, common_1.Post)(':id/confirmar-pago'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "confirmarPago", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reserva_dto_1.UpdateReservaDto]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "remove", null);
exports.ReservaController = ReservaController = __decorate([
    (0, common_1.Controller)('reserva'),
    __metadata("design:paramtypes", [reserva_service_1.ReservaService])
], ReservaController);
//# sourceMappingURL=reserva.controller.js.map
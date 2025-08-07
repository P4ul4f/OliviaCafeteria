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
exports.ReservaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserva_entity_1 = require("./reserva.entity");
const precios_config_service_1 = require("../precios-config/precios-config.service");
let ReservaService = class ReservaService {
    reservaRepository;
    preciosConfigService;
    constructor(reservaRepository, preciosConfigService) {
        this.reservaRepository = reservaRepository;
        this.preciosConfigService = preciosConfigService;
    }
    PRECIOS = {
        [reserva_entity_1.TipoReserva.A_LA_CARTA]: 0,
        [reserva_entity_1.TipoReserva.MERIENDA_LIBRE]: 17500,
        [reserva_entity_1.TipoReserva.TARDE_TE]: 18500,
    };
    CAPACIDAD_MAXIMA_TURNO_TARDE_TE = 5;
    async create(dto) {
        const isAvailable = await this.checkAvailability({
            fecha: dto.fechaHora,
            turno: dto.turno,
            tipoReserva: dto.tipoReserva,
            cantidadPersonas: dto.cantidadPersonas,
        });
        if (!isAvailable.disponible) {
            throw new common_1.BadRequestException(isAvailable.mensaje || 'No hay disponibilidad para la fecha y horario seleccionados');
        }
        if (!dto.montoTotal) {
            dto.montoTotal = await this.calcularPrecio(dto.tipoReserva, dto.cantidadPersonas);
        }
        const reserva = this.reservaRepository.create({
            nombreCliente: dto.nombreCliente,
            telefono: dto.telefono,
            fechaHora: dto.fechaHora,
            turno: dto.turno,
            cantidadPersonas: dto.cantidadPersonas,
            tipoReserva: dto.tipoReserva,
            montoTotal: dto.montoTotal,
            montoSenia: 0,
            estado: reserva_entity_1.EstadoReserva.PENDIENTE,
            estadoPago: reserva_entity_1.EstadoPago.PENDIENTE,
        });
        return this.reservaRepository.save(reserva);
    }
    async createConPago(dto) {
        const isAvailable = await this.checkAvailability({
            fecha: dto.fechaHora,
            turno: dto.turno,
            tipoReserva: dto.tipoReserva,
            cantidadPersonas: dto.cantidadPersonas,
        });
        if (!isAvailable.disponible) {
            throw new common_1.BadRequestException(isAvailable.mensaje || 'No hay disponibilidad para la fecha y horario seleccionados');
        }
        if (!dto.montoTotal) {
            dto.montoTotal = await this.calcularPrecio(dto.tipoReserva, dto.cantidadPersonas);
        }
        const reserva = this.reservaRepository.create({
            nombreCliente: dto.nombreCliente,
            telefono: dto.telefono,
            fechaHora: dto.fechaHora,
            turno: dto.turno,
            cantidadPersonas: dto.cantidadPersonas,
            tipoReserva: dto.tipoReserva,
            montoTotal: dto.montoTotal,
            montoSenia: dto.montoSenia || 0,
            estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
            estadoPago: reserva_entity_1.EstadoPago.PAGADO,
            idPagoExterno: dto.idPagoExterno,
            metodoPago: dto.metodoPago,
        });
        return this.reservaRepository.save(reserva);
    }
    async findAll() {
        return this.reservaRepository.find({
            order: { fechaCreacion: 'DESC' },
        });
    }
    async findOne(id) {
        console.log('🔍 findOne llamado con ID:', { id, tipo: typeof id });
        if (id === null || id === undefined || isNaN(id)) {
            console.error('❌ ID inválido en findOne:', { id, tipo: typeof id });
            const error = new Error('ID inválido');
            console.error('Stack trace:', error.stack);
            throw new common_1.BadRequestException('ID de reserva inválido');
        }
        return this.reservaRepository.findOne({ where: { id } });
    }
    async update(id, dto) {
        const reserva = await this.findOne(id);
        if (reserva) {
            console.log('📝 PATCH reserva', { id, dto, estadoAntes: reserva.estado });
            if (dto.estado && typeof dto.estado === 'string') {
                dto.estado = dto.estado.toUpperCase();
            }
            Object.assign(reserva, dto);
            const saved = await this.reservaRepository.save(reserva);
            console.log('✅ Reserva actualizada', { id, estadoDespues: saved.estado });
            return saved;
        }
        return null;
    }
    async remove(id) {
        const result = await this.reservaRepository.delete(id);
        return (result.affected || 0) > 0;
    }
    async checkAvailability(dto) {
        const { fecha, turno, tipoReserva, cantidadPersonas } = dto;
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);
        const reservasExistentes = await this.reservaRepository.find({
            where: {
                fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                turno,
                tipoReserva,
                estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
            },
        });
        if (tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
            const reservasExistentesTurno = reservasExistentes.length;
            const capacidadDisponible = this.CAPACIDAD_MAXIMA_TURNO_TARDE_TE - reservasExistentesTurno;
            if (capacidadDisponible <= 0) {
                return {
                    disponible: false,
                    capacidadDisponible: 0,
                    reservasExistentes: reservasExistentesTurno,
                    mensaje: 'Este turno ya no tiene cupos disponibles',
                };
            }
            return {
                disponible: true,
                capacidadDisponible: capacidadDisponible,
                reservasExistentes: reservasExistentesTurno,
                mensaje: 'Disponible',
            };
        }
        else if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
            const capacidadOcupada = reservasExistentes.reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
            const cuposMaximos = await this.preciosConfigService.getCuposMeriendasLibres();
            const capacidadDisponible = cuposMaximos - capacidadOcupada;
            if (capacidadDisponible < cantidadPersonas) {
                return {
                    disponible: false,
                    capacidadDisponible: capacidadDisponible,
                    reservasExistentes: reservasExistentes.length,
                    mensaje: `Solo quedan ${capacidadDisponible} cupos disponibles para este turno`,
                };
            }
            return {
                disponible: true,
                capacidadDisponible: capacidadDisponible,
                reservasExistentes: reservasExistentes.length,
                mensaje: 'Disponible',
            };
        }
        else {
            return {
                disponible: true,
                capacidadDisponible: 999,
                reservasExistentes: reservasExistentes.length,
                mensaje: 'Disponible',
            };
        }
    }
    async getFechasDisponibles(tipoReserva) {
        if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
            return [
                new Date(2025, 7, 8),
                new Date(2025, 7, 9),
                new Date(2025, 7, 15),
                new Date(2025, 7, 16),
                new Date(2025, 7, 29),
                new Date(2025, 7, 30),
            ];
        }
        const fechasDisponibles = [];
        const hoy = new Date();
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() + 3);
        for (let fecha = new Date(hoy); fecha <= fechaLimite; fecha.setDate(fecha.getDate() + 1)) {
            if (fecha.getDay() !== 0) {
                if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA) {
                    fechasDisponibles.push(new Date(fecha));
                }
                else {
                    const fechaMinima = new Date();
                    fechaMinima.setDate(fechaMinima.getDate() + 2);
                    if (fecha >= fechaMinima) {
                        fechasDisponibles.push(new Date(fecha));
                    }
                }
            }
        }
        return fechasDisponibles;
    }
    async getFechasDisponiblesConCupos(tipoReserva) {
        const fechasBase = await this.getFechasDisponibles(tipoReserva);
        const fechasConCupos = [];
        for (const fecha of fechasBase) {
            const fechaInicio = new Date(fecha);
            fechaInicio.setHours(0, 0, 0, 0);
            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999);
            const horarios = await this.getHorariosDisponibles(fecha, tipoReserva);
            let fechaDisponible = false;
            let cuposDisponibles = 0;
            if (tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
                for (const horario of horarios) {
                    const reservasExistentes = await this.reservaRepository.find({
                        where: {
                            fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                            turno: horario,
                            tipoReserva,
                            estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                        },
                    });
                    if (reservasExistentes.length < this.CAPACIDAD_MAXIMA_TURNO_TARDE_TE) {
                        fechaDisponible = true;
                        cuposDisponibles += this.CAPACIDAD_MAXIMA_TURNO_TARDE_TE - reservasExistentes.length;
                    }
                }
            }
            else if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
                const turnos = ['16:30-18:30', '19:00-21:00'];
                for (const turno of turnos) {
                    const reservasExistentes = await this.reservaRepository.find({
                        where: {
                            fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                            turno,
                            tipoReserva,
                            estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                        },
                    });
                    const capacidadOcupada = reservasExistentes.reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
                    const cuposMaximos = await this.preciosConfigService.getCuposMeriendasLibres();
                    const cuposDisponiblesTurno = cuposMaximos - capacidadOcupada;
                    if (cuposDisponiblesTurno > 0) {
                        fechaDisponible = true;
                        cuposDisponibles += cuposDisponiblesTurno;
                    }
                }
            }
            else {
                fechaDisponible = true;
                cuposDisponibles = 999;
            }
            fechasConCupos.push({
                fecha: new Date(fecha),
                disponible: fechaDisponible,
                cuposDisponibles,
            });
        }
        return fechasConCupos;
    }
    async getHorariosDisponibles(fecha, tipoReserva) {
        console.log('🕒 getHorariosDisponibles llamado con:', { fecha, tipoReserva });
        if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
            console.log('📋 Devolviendo horarios para merienda libre');
            return ['16:30-18:30', '19:00-21:00'];
        }
        if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA) {
            console.log('🍽️ Devolviendo horarios para a la carta');
            return ['12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
        }
        console.log('🫖 Procesando horarios para tarde de té');
        const fechaMinima = new Date();
        fechaMinima.setDate(fechaMinima.getDate() + 2);
        console.log('⏰ Verificando anticipación:', { fecha: fecha.toISOString(), fechaMinima: fechaMinima.toISOString() });
        if (fecha < fechaMinima) {
            console.log('❌ Fecha no cumple anticipación, devolviendo array vacío');
            return [];
        }
        console.log('✅ Fecha cumple anticipación, generando horarios');
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
        for (let hora = 17; hora <= 20; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                if (hora === 20 && minuto === 30)
                    break;
                const horaStr = hora.toString().padStart(2, '0');
                const minutoStr = minuto.toString().padStart(2, '0');
                horarios.push(`${horaStr}:${minutoStr}`);
            }
        }
        console.log('🎯 Horarios generados:', horarios);
        return horarios;
    }
    async getHorariosDisponiblesConCupos(fecha, tipoReserva) {
        const horariosBase = await this.getHorariosDisponibles(fecha, tipoReserva);
        if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
            const horariosConCupos = [];
            const fechaInicio = new Date(fecha);
            fechaInicio.setHours(0, 0, 0, 0);
            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999);
            const turnos = ['16:30-18:30', '19:00-21:00'];
            for (const turno of turnos) {
                const reservasExistentes = await this.reservaRepository.find({
                    where: {
                        fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                        turno,
                        tipoReserva,
                        estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                    },
                });
                const capacidadOcupada = reservasExistentes.reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
                const cuposMaximos = await this.preciosConfigService.getCuposMeriendasLibres();
                const cuposDisponibles = cuposMaximos - capacidadOcupada;
                const disponible = cuposDisponibles > 0;
                horariosConCupos.push({
                    horario: turno,
                    disponible,
                    cuposDisponibles,
                });
            }
            return horariosConCupos;
        }
        else if (tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
            const horariosConCupos = [];
            const fechaInicio = new Date(fecha);
            fechaInicio.setHours(0, 0, 0, 0);
            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999);
            for (const horario of horariosBase) {
                const reservasExistentes = await this.reservaRepository.find({
                    where: {
                        fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                        turno: horario,
                        tipoReserva,
                        estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                    },
                });
                const cuposDisponibles = this.CAPACIDAD_MAXIMA_TURNO_TARDE_TE - reservasExistentes.length;
                const disponible = cuposDisponibles > 0;
                horariosConCupos.push({
                    horario,
                    disponible,
                    cuposDisponibles,
                });
            }
            return horariosConCupos;
        }
        else {
            return horariosBase.map(horario => ({
                horario,
                disponible: true,
                cuposDisponibles: 999,
            }));
        }
    }
    async calcularPrecio(tipoReserva, cantidadPersonas) {
        if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA) {
            const precioALaCarta = await this.preciosConfigService.getPrecioALaCarta();
            return precioALaCarta * cantidadPersonas;
        }
        return this.PRECIOS[tipoReserva] * cantidadPersonas;
    }
    async confirmarPago(id, idPagoExterno, metodoPago) {
        const reserva = await this.findOne(id);
        if (!reserva) {
            throw new common_1.BadRequestException('Reserva no encontrada');
        }
        reserva.estadoPago = reserva_entity_1.EstadoPago.PAGADO;
        reserva.estado = reserva_entity_1.EstadoReserva.CONFIRMADA;
        reserva.idPagoExterno = idPagoExterno;
        reserva.metodoPago = metodoPago;
        return this.reservaRepository.save(reserva);
    }
};
exports.ReservaService = ReservaService;
exports.ReservaService = ReservaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        precios_config_service_1.PreciosConfigService])
], ReservaService);
//# sourceMappingURL=reserva.service.js.map
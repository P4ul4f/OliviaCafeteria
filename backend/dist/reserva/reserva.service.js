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
const fechas_config_entity_1 = require("../fechas-config/fechas-config.entity");
let ReservaService = class ReservaService {
    reservaRepository;
    fechasConfigRepository;
    preciosConfigService;
    constructor(reservaRepository, fechasConfigRepository, preciosConfigService) {
        this.reservaRepository = reservaRepository;
        this.fechasConfigRepository = fechasConfigRepository;
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
        if (id === null || id === undefined || isNaN(id)) {
            console.error('❌ ID inválido en findOne:', { id, tipo: typeof id });
            throw new common_1.BadRequestException('ID de reserva inválido');
        }
        return this.reservaRepository.findOne({ where: { id } });
    }
    async update(id, dto) {
        const reserva = await this.findOne(id);
        if (reserva) {
            if (dto.estado && typeof dto.estado === 'string') {
                dto.estado = dto.estado.toUpperCase();
            }
            Object.assign(reserva, dto);
            const saved = await this.reservaRepository.save(reserva);
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
        if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA || tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
            const esMeriendaLibre = await this.esDiaMeriendaLibre(fechaInicio);
            if (esMeriendaLibre) {
                return {
                    disponible: false,
                    capacidadDisponible: 0,
                    reservasExistentes: 0,
                    mensaje: 'No se permiten reservas de A la Carta ni Tardes de Té en días de Meriendas Libres',
                };
            }
        }
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
        try {
            if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaLimite = new Date(hoy.getTime() + 90 * 24 * 60 * 60 * 1000);
                fechaLimite.setHours(23, 59, 59, 999);
                console.log(`🔍 Buscando fechas meriendas libres entre ${hoy.toISOString()} y ${fechaLimite.toISOString()}`);
                const fechasConfig = await this.fechasConfigRepository.find({
                    where: {
                        activo: true,
                        fecha: (0, typeorm_2.Between)(hoy, fechaLimite)
                    },
                    order: {
                        fecha: 'ASC'
                    }
                });
                console.log(`📅 Fechas encontradas en DB: ${fechasConfig.length}`);
                fechasConfig.forEach((fc, i) => {
                    console.log(`  ${i + 1}. ${fc.fecha.toISOString()} (día: ${fc.fecha.getDate()})`);
                });
                const fechasDisponibles = fechasConfig
                    .map(fechaConfig => fechaConfig.fecha)
                    .filter(fecha => {
                    const fechaSoloDia = new Date(fecha);
                    fechaSoloDia.setHours(0, 0, 0, 0);
                    const hoySoloDia = new Date();
                    hoySoloDia.setHours(0, 0, 0, 0);
                    return fechaSoloDia >= hoySoloDia;
                })
                    .sort((a, b) => a.getTime() - b.getTime());
                console.log(`✅ Fechas disponibles después de filtrar: ${fechasDisponibles.length}`);
                return fechasDisponibles;
            }
            const fechasDisponibles = [];
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaLimite = new Date();
            fechaLimite.setMonth(fechaLimite.getMonth() + 3);
            const diasMeriendasLibres = await this.fechasConfigRepository.find({
                where: {
                    activo: true,
                    fecha: (0, typeorm_2.Between)(hoy, fechaLimite)
                }
            });
            console.log('🔍 Días de meriendas libres encontrados:', diasMeriendasLibres.length);
            const fechasMeriendasLibres = new Set(diasMeriendasLibres.map(fechaConfig => {
                const fecha = new Date(fechaConfig.fecha);
                fecha.setHours(0, 0, 0, 0);
                return fecha.getTime();
            }));
            console.log('📅 Fechas de meriendas libres a excluir:', Array.from(fechasMeriendasLibres).map(timestamp => new Date(timestamp).toISOString().split('T')[0]));
            for (let fecha = new Date(hoy); fecha <= fechaLimite; fecha.setDate(fecha.getDate() + 1)) {
                const fechaIteracion = new Date(fecha);
                fechaIteracion.setHours(0, 0, 0, 0);
                if (fechaIteracion.getDay() !== 0) {
                    const fechaTimestamp = fechaIteracion.getTime();
                    console.log(`🔍 Verificando fecha: ${fechaIteracion.toISOString().split('T')[0]} - ¿Es de meriendas libres? ${fechasMeriendasLibres.has(fechaTimestamp)}`);
                    if (!fechasMeriendasLibres.has(fechaTimestamp)) {
                        if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA) {
                            fechasDisponibles.push(new Date(fechaIteracion));
                        }
                        else {
                            const fechaMinima = new Date();
                            fechaMinima.setDate(fechaMinima.getDate() + 2);
                            fechaMinima.setHours(0, 0, 0, 0);
                            if (fechaIteracion >= fechaMinima) {
                                fechasDisponibles.push(new Date(fechaIteracion));
                            }
                        }
                    }
                    else {
                        console.log(`❌ Fecha ${fechaIteracion.toISOString().split('T')[0]} excluida por ser día de meriendas libres`);
                    }
                }
            }
            console.log(`✅ Fechas disponibles para ${tipoReserva}:`, fechasDisponibles.length);
            return fechasDisponibles;
        }
        catch (error) {
            console.error('❌ Error en getFechasDisponibles:', error);
            return [
                new Date(2025, 7, 8),
                new Date(2025, 7, 9),
                new Date(2025, 7, 15),
                new Date(2025, 7, 16),
                new Date(2025, 7, 29),
                new Date(2025, 7, 30),
            ];
        }
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
            if (tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE || tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA) {
                for (const horario of horarios) {
                    const capacidadCompartida = await this.calcularCapacidadCompartida(fecha, horario);
                    const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
                    console.log(`🏢 Capacidad máxima obtenida del servicio: ${capacidadMaxima}`);
                    const cuposDisponiblesHorario = Math.max(0, capacidadMaxima - capacidadCompartida);
                    if (cuposDisponiblesHorario > 0) {
                        fechaDisponible = true;
                        cuposDisponibles += cuposDisponiblesHorario;
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
            fechasConCupos.push({
                fecha: new Date(fecha),
                disponible: fechaDisponible,
                cuposDisponibles,
            });
        }
        return fechasConCupos;
    }
    async getHorariosDisponibles(fecha, tipoReserva) {
        if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA || tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
            const esMeriendaLibre = await this.esDiaMeriendaLibre(fecha);
            if (esMeriendaLibre) {
                return [];
            }
        }
        if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
            return ['16:30-18:30', '19:00-21:00'];
        }
        if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA) {
            return ['12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
        }
        const fechaMinima = new Date();
        fechaMinima.setDate(fechaMinima.getDate() + 2);
        if (fecha < fechaMinima) {
            return [];
        }
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
        else if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA || tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
            if (horariosBase.length === 0) {
                return [];
            }
            const horariosConCupos = [];
            for (const horario of horariosBase) {
                const capacidadCompartida = await this.calcularCapacidadCompartida(fecha, horario);
                const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
                console.log(`🏢 Capacidad máxima obtenida del servicio: ${capacidadMaxima}`);
                const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadCompartida);
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
    async getCuposDisponibles(fecha, turno, tipoReserva) {
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);
        if (tipoReserva === reserva_entity_1.TipoReserva.MERIENDA_LIBRE) {
            const reservasExistentes = await this.reservaRepository.find({
                where: {
                    fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                    turno,
                    tipoReserva,
                    estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                },
            });
            const capacidadOcupada = reservasExistentes.reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
            const capacidadMaxima = await this.preciosConfigService.getCuposMeriendasLibres();
            const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadOcupada);
            return {
                cuposDisponibles,
                capacidadMaxima,
                capacidadOcupada,
                reservasExistentes: reservasExistentes.length,
            };
        }
        else if (tipoReserva === reserva_entity_1.TipoReserva.A_LA_CARTA || tipoReserva === reserva_entity_1.TipoReserva.TARDE_TE) {
            const esMeriendaLibre = await this.esDiaMeriendaLibre(fechaInicio);
            if (esMeriendaLibre) {
                return {
                    cuposDisponibles: 0,
                    capacidadMaxima: 0,
                    capacidadOcupada: 0,
                    reservasExistentes: 0,
                };
            }
            console.log(`🔍 === INICIO getCuposDisponibles para ${tipoReserva} (SISTEMA POR HORAS) ===`);
            console.log(`📅 Fecha recibida:`, {
                fecha: fecha.toISOString(),
                fechaLocal: fecha.toLocaleDateString('es-ES'),
                timestamp: fecha.getTime()
            });
            console.log(`🕒 Turno: ${turno}`);
            const bloqueHorario = this.obtenerBloqueHorario(turno);
            console.log(`⏰ Bloque horario calculado: ${bloqueHorario}`);
            const todasReservasDelDia = await this.reservaRepository.find({
                where: {
                    fechaHora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                    tipoReserva: (0, typeorm_2.In)([reserva_entity_1.TipoReserva.A_LA_CARTA, reserva_entity_1.TipoReserva.TARDE_TE]),
                    estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
                },
            });
            console.log(`📊 Total reservas del día encontradas:`, todasReservasDelDia.length);
            const reservasPorBloque = this.agruparReservasPorBloqueHorario(todasReservasDelDia);
            console.log(`📋 Reservas agrupadas por bloque:`, Object.keys(reservasPorBloque).map(bloque => ({
                bloque,
                reservas: reservasPorBloque[bloque].length,
                personas: reservasPorBloque[bloque].reduce((sum, r) => sum + r.cantidadPersonas, 0)
            })));
            const reservasDelBloque = reservasPorBloque[bloqueHorario] || [];
            const capacidadOcupada = reservasDelBloque.reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
            const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
            console.log(`🏢 Capacidad máxima obtenida del servicio: ${capacidadMaxima}`);
            const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadOcupada);
            console.log(`🔍 Cupos para ${tipoReserva} en bloque ${bloqueHorario}:00:`, {
                bloqueHorario: `${bloqueHorario}:00`,
                capacidadMaxima,
                capacidadOcupada,
                cuposDisponibles,
                reservasEnBloque: reservasDelBloque.length,
                totalReservasDelDia: todasReservasDelDia.length,
                reservasDelBloque: reservasDelBloque.map(r => ({
                    id: r.id,
                    tipo: r.tipoReserva,
                    personas: r.cantidadPersonas,
                    turno: r.turno
                }))
            });
            console.log(`🔍 === FIN getCuposDisponibles para ${tipoReserva} (SISTEMA POR HORAS) ===`);
            return {
                cuposDisponibles,
                capacidadMaxima,
                capacidadOcupada,
                reservasExistentes: reservasDelBloque.length,
            };
        }
        else {
            return {
                cuposDisponibles: 0,
                capacidadMaxima: 0,
                capacidadOcupada: 0,
                reservasExistentes: 0,
            };
        }
    }
    async calcularCapacidadCompartida(fecha, turno) {
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);
        const bloqueHorario = this.obtenerBloqueHorario(turno);
        console.log(`⏰ Calculando capacidad para bloque horario: ${bloqueHorario} (turno: ${turno})`);
        const fechaInicioAmpliada = new Date(fecha);
        fechaInicioAmpliada.setHours(0, 0, 0, 0);
        const fechaFinAmpliada = new Date(fecha);
        fechaFinAmpliada.setDate(fechaFinAmpliada.getDate() + 1);
        fechaFinAmpliada.setHours(23, 59, 59, 999);
        console.log(`🔍 Buscando reservas en rango ampliado:`, {
            desde: fechaInicioAmpliada.toISOString(),
            hasta: fechaFinAmpliada.toISOString(),
            fechaOriginal: fecha.toISOString()
        });
        const todasReservasDelRango = await this.reservaRepository.find({
            where: {
                fechaHora: (0, typeorm_2.Between)(fechaInicioAmpliada, fechaFinAmpliada),
                tipoReserva: (0, typeorm_2.In)([reserva_entity_1.TipoReserva.A_LA_CARTA, reserva_entity_1.TipoReserva.TARDE_TE]),
                estado: reserva_entity_1.EstadoReserva.CONFIRMADA,
            },
        });
        console.log(`📋 Reservas encontradas en rango ampliado:`, todasReservasDelRango.map(r => ({
            id: r.id,
            fechaHora: r.fechaHora.toISOString(),
            turno: r.turno,
            personas: r.cantidadPersonas,
            tipo: r.tipoReserva
        })));
        const reservasPorBloque = this.agruparReservasPorBloqueHorario(todasReservasDelRango);
        const reservasDelBloque = reservasPorBloque[bloqueHorario] || [];
        const capacidadOcupada = reservasDelBloque.reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
        console.log(`🔍 calcularCapacidadCompartida para bloque ${bloqueHorario}:`, {
            fecha: fecha.toDateString(),
            turno,
            bloqueHorario,
            totalReservasEnRango: todasReservasDelRango.length,
            reservasEnEsteBloque: reservasDelBloque.length,
            capacidadOcupada,
            detallesBloque: reservasDelBloque.map(r => ({
                id: r.id,
                tipo: r.tipoReserva,
                turno: r.turno,
                personas: r.cantidadPersonas,
                bloqueCalculado: this.obtenerBloqueHorario(r.turno),
                fechaHora: r.fechaHora.toISOString()
            }))
        });
        return capacidadOcupada;
    }
    async esDiaMeriendaLibre(fecha) {
        const inicio = new Date(fecha);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);
        const count = await this.fechasConfigRepository.count({
            where: {
                fecha: (0, typeorm_2.Between)(inicio, fin),
                activo: true,
            },
        });
        return count > 0;
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
    obtenerBloqueHorario(turno) {
        try {
            const match = turno.match(/^(\d{1,2}):(\d{2})/);
            if (!match) {
                console.warn(`⚠️ Formato de turno no reconocido: ${turno}, usando bloque 12`);
                return "12";
            }
            const horaInicio = parseInt(match[1], 10);
            const minutoInicio = parseInt(match[2], 10);
            const bloqueHora = minutoInicio >= 30 ? horaInicio : horaInicio;
            console.log(`🕒 Turno "${turno}" → Bloque horario: ${bloqueHora}`);
            return bloqueHora.toString();
        }
        catch (error) {
            console.error(`❌ Error procesando turno ${turno}:`, error);
            return "12";
        }
    }
    agruparReservasPorBloqueHorario(reservas) {
        const agrupadas = {};
        for (const reserva of reservas) {
            const bloqueHorario = this.obtenerBloqueHorario(reserva.turno);
            if (!agrupadas[bloqueHorario]) {
                agrupadas[bloqueHorario] = [];
            }
            agrupadas[bloqueHorario].push(reserva);
        }
        Object.keys(agrupadas).forEach(bloque => {
            const personasEnBloque = agrupadas[bloque].reduce((sum, r) => sum + r.cantidadPersonas, 0);
            console.log(`📊 Bloque ${bloque}:00 - ${agrupadas[bloque].length} reservas, ${personasEnBloque} personas`);
        });
        return agrupadas;
    }
};
exports.ReservaService = ReservaService;
exports.ReservaService = ReservaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __param(1, (0, typeorm_1.InjectRepository)(fechas_config_entity_1.FechasConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        precios_config_service_1.PreciosConfigService])
], ReservaService);
//# sourceMappingURL=reserva.service.js.map
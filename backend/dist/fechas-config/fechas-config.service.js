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
exports.FechasConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fechas_config_entity_1 = require("./fechas-config.entity");
let FechasConfigService = class FechasConfigService {
    fechasConfigRepository;
    constructor(fechasConfigRepository) {
        this.fechasConfigRepository = fechasConfigRepository;
    }
    normalizeDateOnly(input) {
        if (!input)
            return null;
        if (typeof input === 'string') {
            const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (match) {
                const year = Number(match[1]);
                const monthIndex = Number(match[2]) - 1;
                const day = Number(match[3]);
                const d = new Date(year, monthIndex, day, 12, 0, 0, 0);
                console.log(`📅 Fecha normalizada: ${input} -> ${d.toISOString()} (día local: ${d.getDate()})`);
                return d;
            }
            const parsed = new Date(input);
            if (!isNaN(parsed.getTime())) {
                const year = parsed.getFullYear();
                const monthIndex = parsed.getMonth();
                const day = parsed.getDate();
                const d = new Date(year, monthIndex, day, 12, 0, 0, 0);
                return d;
            }
        }
        if (input instanceof Date) {
            const year = input.getFullYear();
            const monthIndex = input.getMonth();
            const day = input.getDate();
            const d = new Date(year, monthIndex, day, 12, 0, 0, 0);
            return d;
        }
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    }
    async create(createFechasConfigDto) {
        try {
            console.log('🔍 === DEBUG TIMEZONE - CREATE FECHA ===');
            console.log('📥 Fecha recibida del frontend:', createFechasConfigDto.fecha);
            console.log('🌍 Servidor timezone info:', {
                currentDate: new Date(),
                utcDate: new Date().toISOString(),
                localDate: new Date().toLocaleDateString('es-ES'),
                timezoneOffset: new Date().getTimezoneOffset(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            const payload = { ...createFechasConfigDto };
            if (createFechasConfigDto.fecha) {
                const fechaNormalizada = this.normalizeDateOnly(createFechasConfigDto.fecha);
                console.log('🔄 Fecha después de normalizar:', {
                    original: createFechasConfigDto.fecha,
                    normalizada: fechaNormalizada,
                    normalizadaISO: fechaNormalizada.toISOString(),
                    normalizadaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
                    normalizadaUTCDate: fechaNormalizada.getUTCDate(),
                    normalizadaLocalDate: fechaNormalizada.getDate()
                });
                payload.fecha = fechaNormalizada;
            }
            const fechasConfig = this.fechasConfigRepository.create(payload);
            const resultado = await this.fechasConfigRepository.save(fechasConfig);
            console.log('💾 Fecha guardada en DB:', {
                fechaGuardada: resultado.fecha,
                fechaGuardadaISO: resultado.fecha?.toISOString(),
                fechaGuardadaLocal: resultado.fecha?.toLocaleDateString('es-ES')
            });
            console.log('🔍 === FIN DEBUG TIMEZONE ===');
            return resultado;
        }
        catch (error) {
            console.error('❌ Error creating FechasConfig:', error);
            throw new common_1.InternalServerErrorException('Error creating date configuration');
        }
    }
    serializeFechas(fechas) {
        return fechas.map(fecha => {
            let fechaSerializada = null;
            if (fecha.fecha) {
                fechaSerializada = fecha.fecha.toISOString().split('T')[0];
                console.log(`📤 Serializando fecha: ${fecha.fecha.toISOString()} -> ${fechaSerializada}`);
            }
            return {
                ...fecha,
                fecha: fechaSerializada
            };
        });
    }
    async findAll() {
        try {
            console.log('🔍 FechasConfigService.findAll() - Iniciando consulta...');
            const result = await this.fechasConfigRepository.find({
                order: { fecha: 'ASC' }
            });
            console.log('📅 Fechas encontradas:', result.length);
            console.log('🌍 Servidor timezone info (findAll):', {
                currentDate: new Date(),
                utcDate: new Date().toISOString(),
                localDate: new Date().toLocaleDateString('es-ES'),
                timezoneOffset: new Date().getTimezoneOffset(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            result.forEach((fecha, index) => {
                console.log(`📅 Fecha ${index + 1}:`, {
                    id: fecha.id,
                    fecha: fecha.fecha,
                    fechaType: typeof fecha.fecha,
                    fechaISO: fecha.fecha?.toISOString(),
                    fechaLocal: fecha.fecha?.toLocaleDateString('es-ES'),
                    fechaUTCDate: fecha.fecha?.getUTCDate(),
                    fechaLocalDate: fecha.fecha?.getDate(),
                    activo: fecha.activo,
                    tipoReserva: fecha.tipoReserva,
                    turnos: fecha.turnos
                });
            });
            console.log('✅ FechasConfigService.findAll() - Resultado:', result?.length || 0, 'registros');
            const fechasSerializadas = this.serializeFechas(result);
            console.log('📤 Fechas serializadas para frontend:', fechasSerializadas.length);
            return fechasSerializadas;
        }
        catch (error) {
            console.error('❌ Error in FechasConfigService.findAll():', error);
            console.error('❌ Error stack:', error.stack);
            throw new common_1.InternalServerErrorException('Error retrieving date configurations');
        }
    }
    async findOne(id) {
        try {
            const fechasConfig = await this.fechasConfigRepository.findOne({ where: { id } });
            if (!fechasConfig) {
                throw new common_1.NotFoundException(`FechasConfig with ID ${id} not found`);
            }
            return fechasConfig;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('❌ Error in FechasConfigService.findOne():', error);
            throw new common_1.InternalServerErrorException('Error retrieving date configuration');
        }
    }
    async update(id, updateFechasConfigDto) {
        try {
            const fechasConfig = await this.findOne(id);
            const payload = { ...updateFechasConfigDto };
            if (updateFechasConfigDto.fecha) {
                payload.fecha = this.normalizeDateOnly(updateFechasConfigDto.fecha);
            }
            Object.assign(fechasConfig, payload);
            return await this.fechasConfigRepository.save(fechasConfig);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('❌ Error in FechasConfigService.update():', error);
            throw new common_1.InternalServerErrorException('Error updating date configuration');
        }
    }
    async remove(id) {
        try {
            const fechasConfig = await this.findOne(id);
            await this.fechasConfigRepository.remove(fechasConfig);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('❌ Error in FechasConfigService.remove():', error);
            throw new common_1.InternalServerErrorException('Error removing date configuration');
        }
    }
    async findByTipoReserva(tipoReserva) {
        try {
            console.log(`🔍 FechasConfigService.findByTipoReserva('${tipoReserva}') - Iniciando consulta...`);
            const result = await this.fechasConfigRepository.find({
                where: {
                    activo: true,
                    tipoReserva: tipoReserva
                },
                order: { fecha: 'ASC' }
            });
            console.log(`📅 Fechas encontradas para ${tipoReserva}:`, result.length);
            result.forEach((fecha, index) => {
                console.log(`📅 Fecha ${tipoReserva} ${index + 1}:`, {
                    id: fecha.id,
                    fecha: fecha.fecha,
                    fechaType: typeof fecha.fecha,
                    fechaISO: fecha.fecha?.toISOString(),
                    fechaLocal: fecha.fecha?.toLocaleDateString('es-ES'),
                    activo: fecha.activo,
                    tipoReserva: fecha.tipoReserva,
                    turnos: fecha.turnos
                });
            });
            console.log(`✅ FechasConfigService.findByTipoReserva('${tipoReserva}') - Resultado:`, result?.length || 0, 'registros');
            const fechasSerializadas = this.serializeFechas(result);
            console.log(`📤 Fechas serializadas para frontend (${tipoReserva}):`, fechasSerializadas.length);
            return fechasSerializadas;
        }
        catch (error) {
            console.error('❌ Error in FechasConfigService.findByTipoReserva():', error);
            throw new common_1.InternalServerErrorException('Error retrieving date configurations by type');
        }
    }
};
exports.FechasConfigService = FechasConfigService;
exports.FechasConfigService = FechasConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fechas_config_entity_1.FechasConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FechasConfigService);
//# sourceMappingURL=fechas-config.service.js.map
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
    async create(createFechasConfigDto) {
        const fechasConfig = this.fechasConfigRepository.create(createFechasConfigDto);
        return await this.fechasConfigRepository.save(fechasConfig);
    }
    async findAll() {
        return await this.fechasConfigRepository.find({ order: { fecha: 'ASC' } });
    }
    async findOne(id) {
        const fechasConfig = await this.fechasConfigRepository.findOne({ where: { id } });
        if (!fechasConfig) {
            throw new common_1.NotFoundException(`FechasConfig with ID ${id} not found`);
        }
        return fechasConfig;
    }
    async update(id, updateFechasConfigDto) {
        const fechasConfig = await this.findOne(id);
        Object.assign(fechasConfig, updateFechasConfigDto);
        return await this.fechasConfigRepository.save(fechasConfig);
    }
    async remove(id) {
        const fechasConfig = await this.findOne(id);
        await this.fechasConfigRepository.remove(fechasConfig);
    }
    async findByTipoReserva(tipoReserva) {
        return await this.fechasConfigRepository.find({
            where: { tipoReserva, activo: true },
            order: { fecha: 'ASC' }
        });
    }
};
exports.FechasConfigService = FechasConfigService;
exports.FechasConfigService = FechasConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fechas_config_entity_1.FechasConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FechasConfigService);
//# sourceMappingURL=fechas-config.service.js.map
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
exports.ContenidoConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contenido_config_entity_1 = require("./contenido-config.entity");
let ContenidoConfigService = class ContenidoConfigService {
    contenidoConfigRepository;
    constructor(contenidoConfigRepository) {
        this.contenidoConfigRepository = contenidoConfigRepository;
    }
    async create(dto) {
        const contenidoConfig = this.contenidoConfigRepository.create(dto);
        return this.contenidoConfigRepository.save(contenidoConfig);
    }
    async findAll() {
        return this.contenidoConfigRepository.find({
            order: { fechaCreacion: 'DESC' },
        });
    }
    async findOne(id) {
        return this.contenidoConfigRepository.findOne({ where: { id } });
    }
    async findByClave(clave) {
        return this.contenidoConfigRepository.findOne({ where: { clave } });
    }
    async update(id, dto) {
        const contenidoConfig = await this.findOne(id);
        if (contenidoConfig) {
            Object.assign(contenidoConfig, dto);
            return this.contenidoConfigRepository.save(contenidoConfig);
        }
        return null;
    }
    async updateByClave(clave, dto) {
        const contenidoConfig = await this.findByClave(clave);
        if (contenidoConfig) {
            Object.assign(contenidoConfig, dto);
            return this.contenidoConfigRepository.save(contenidoConfig);
        }
        return null;
    }
    async remove(id) {
        const result = await this.contenidoConfigRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async getMeriendasLibresContenido() {
        const config = await this.findByClave('meriendas_libres_contenido');
        return config ? config.contenido : null;
    }
    async updateMeriendasLibresContenido(contenido) {
        const config = await this.findByClave('meriendas_libres_contenido');
        if (config) {
            config.contenido = contenido;
            return this.contenidoConfigRepository.save(config);
        }
        else {
            return this.create({
                clave: 'meriendas_libres_contenido',
                contenido,
                descripcion: 'Contenido configurable de Meriendas Libres'
            });
        }
    }
    async getTardesTePromoOliviaContenido() {
        const config = await this.findByClave('tardes_te_promo_olivia_contenido');
        return config ? config.contenido : null;
    }
    async updateTardesTePromoOliviaContenido(contenido) {
        const config = await this.findByClave('tardes_te_promo_olivia_contenido');
        if (config) {
            config.contenido = contenido;
            return this.contenidoConfigRepository.save(config);
        }
        else {
            return this.create({
                clave: 'tardes_te_promo_olivia_contenido',
                contenido,
                descripcion: 'Contenido configurable de Tardes de Té - Promo Olivia'
            });
        }
    }
    async getTardesTePromoBasicaContenido() {
        const config = await this.findByClave('tardes_te_promo_basica_contenido');
        return config ? config.contenido : null;
    }
    async updateTardesTePromoBasicaContenido(contenido) {
        const config = await this.findByClave('tardes_te_promo_basica_contenido');
        if (config) {
            config.contenido = contenido;
            return this.contenidoConfigRepository.save(config);
        }
        else {
            return this.create({
                clave: 'tardes_te_promo_basica_contenido',
                contenido,
                descripcion: 'Contenido configurable de Tardes de Té - Promo Básica'
            });
        }
    }
};
exports.ContenidoConfigService = ContenidoConfigService;
exports.ContenidoConfigService = ContenidoConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contenido_config_entity_1.ContenidoConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContenidoConfigService);
//# sourceMappingURL=contenido-config.service.js.map
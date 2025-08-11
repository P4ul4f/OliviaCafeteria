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
exports.PreciosConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const precios_config_entity_1 = require("./precios-config.entity");
let PreciosConfigService = class PreciosConfigService {
    preciosConfigRepo;
    constructor(preciosConfigRepo) {
        this.preciosConfigRepo = preciosConfigRepo;
    }
    async getMeriendaLibrePrice() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config)
            throw new common_1.NotFoundException('Configuración de precios no encontrada');
        return Number(config.meriendaLibre);
    }
    async getAllConfig() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config)
            throw new common_1.NotFoundException('Configuración de precios no encontrada');
        return config;
    }
    async getCuposMeriendasLibres() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config)
            throw new common_1.NotFoundException('Configuración de precios no encontrada');
        return config.cuposMeriendasLibres;
    }
    async updateCuposMeriendasLibres(cupos) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config) {
            throw new Error('Configuración de precios no encontrada');
        }
        config.cuposMeriendasLibres = cupos;
        return this.preciosConfigRepo.save(config);
    }
    async updateMeriendaLibrePrice(newPrice) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config)
            throw new common_1.NotFoundException('Configuración de precios no encontrada');
        config.meriendaLibre = newPrice;
        return this.preciosConfigRepo.save(config);
    }
    async getPrecioPromoOlivia() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        return config ? config.promoOlivia : 0;
    }
    async updatePrecioPromoOlivia(precio) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config) {
            throw new Error('Configuración de precios no encontrada');
        }
        config.promoOlivia = precio;
        return this.preciosConfigRepo.save(config);
    }
    async getPrecioPromoBasica() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        return config ? config.promoBasica : 0;
    }
    async updatePrecioPromoBasica(precio) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config) {
            throw new Error('Configuración de precios no encontrada');
        }
        config.promoBasica = precio;
        return this.preciosConfigRepo.save(config);
    }
    async getCuposTardesDeTe() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        return config ? config.cuposTardesDeTe : 65;
    }
    async updateCuposTardesDeTe(cupos) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config) {
            throw new Error('Configuración de precios no encontrada');
        }
        config.cuposTardesDeTe = cupos;
        return this.preciosConfigRepo.save(config);
    }
    async getPrecioALaCarta() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        return config ? config.aLaCarta : 5000;
    }
    async updatePrecioALaCarta(precio) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config) {
            throw new Error('Configuración de precios no encontrada');
        }
        config.aLaCarta = precio;
        return this.preciosConfigRepo.save(config);
    }
    async getPrecioTardeDeTe() {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        return config ? config.tardeDeTe : 0;
    }
    async updatePrecioTardeDeTe(precio) {
        const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
        if (!config) {
            throw new Error('Configuración de precios no encontrada');
        }
        config.tardeDeTe = precio;
        return this.preciosConfigRepo.save(config);
    }
    async getCapacidadMaximaCompartida() {
        const config = await this.preciosConfigRepo.findOne({
            where: { clave: 'precios_principales' }
        });
        return config?.capacidadMaximaCompartida || 65;
    }
};
exports.PreciosConfigService = PreciosConfigService;
exports.PreciosConfigService = PreciosConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(precios_config_entity_1.PreciosConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PreciosConfigService);
//# sourceMappingURL=precios-config.service.js.map
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
exports.SiteConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_config_entity_1 = require("./site-config.entity");
let SiteConfigService = class SiteConfigService {
    siteConfigRepository;
    constructor(siteConfigRepository) {
        this.siteConfigRepository = siteConfigRepository;
    }
    async getMainConfig() {
        const config = await this.siteConfigRepository.findOne({
            where: { clave: 'info_general' }
        });
        if (!config) {
            throw new common_1.NotFoundException('Configuración del sitio no encontrada');
        }
        return config;
    }
    async updateMainConfig(updateDto) {
        const config = await this.getMainConfig();
        Object.assign(config, updateDto);
        return this.siteConfigRepository.save(config);
    }
    async getHorarios() {
        const config = await this.getMainConfig();
        return config.horarios;
    }
    async getContactInfo() {
        const config = await this.getMainConfig();
        return {
            telefono: config.telefono,
            direccion: config.direccion,
            email: config.email
        };
    }
};
exports.SiteConfigService = SiteConfigService;
exports.SiteConfigService = SiteConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_config_entity_1.SiteConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SiteConfigService);
//# sourceMappingURL=site-config.service.js.map
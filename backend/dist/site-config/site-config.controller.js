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
exports.SiteConfigController = void 0;
const common_1 = require("@nestjs/common");
const site_config_service_1 = require("./site-config.service");
const update_site_config_dto_1 = require("./dto/update-site-config.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SiteConfigController = class SiteConfigController {
    siteConfigService;
    constructor(siteConfigService) {
        this.siteConfigService = siteConfigService;
    }
    async getPublicConfig() {
        const config = await this.siteConfigService.getMainConfig();
        return {
            telefono: config.telefono,
            direccion: config.direccion,
            email: config.email,
            horarios: config.horarios
        };
    }
    async getHorarios() {
        return this.siteConfigService.getHorarios();
    }
    async getContacto() {
        return this.siteConfigService.getContactInfo();
    }
    async getAdminConfig() {
        return this.siteConfigService.getMainConfig();
    }
    async updateConfig(updateDto) {
        const updatedConfig = await this.siteConfigService.updateMainConfig(updateDto);
        return {
            message: 'Configuración actualizada exitosamente',
            data: updatedConfig
        };
    }
    async updateHorarios(horarios) {
        const updateDto = { horarios };
        const updatedConfig = await this.siteConfigService.updateMainConfig(updateDto);
        return {
            message: 'Horarios actualizados exitosamente',
            data: updatedConfig.horarios
        };
    }
};
exports.SiteConfigController = SiteConfigController;
__decorate([
    (0, common_1.Get)('site-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiteConfigController.prototype, "getPublicConfig", null);
__decorate([
    (0, common_1.Get)('horarios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiteConfigController.prototype, "getHorarios", null);
__decorate([
    (0, common_1.Get)('contacto'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiteConfigController.prototype, "getContacto", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/site-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiteConfigController.prototype, "getAdminConfig", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('admin/site-config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_site_config_dto_1.UpdateSiteConfigDto]),
    __metadata("design:returntype", Promise)
], SiteConfigController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('admin/horarios'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiteConfigController.prototype, "updateHorarios", null);
exports.SiteConfigController = SiteConfigController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [site_config_service_1.SiteConfigService])
], SiteConfigController);
//# sourceMappingURL=site-config.controller.js.map
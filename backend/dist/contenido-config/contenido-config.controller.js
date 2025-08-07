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
exports.ContenidoConfigController = void 0;
const common_1 = require("@nestjs/common");
const contenido_config_service_1 = require("./contenido-config.service");
const create_contenido_config_dto_1 = require("./dto/create-contenido-config.dto");
let ContenidoConfigController = class ContenidoConfigController {
    contenidoConfigService;
    constructor(contenidoConfigService) {
        this.contenidoConfigService = contenidoConfigService;
        console.log('ContenidoConfigController initialized');
    }
    async create(dto) {
        return this.contenidoConfigService.create(dto);
    }
    async findAll() {
        console.log('GET /contenido-config called');
        return { message: 'ContenidoConfig controller is working' };
    }
    async getMeriendasLibresContenido() {
        return this.contenidoConfigService.getMeriendasLibresContenido();
    }
    async updateMeriendasLibresContenido(contenido) {
        return this.contenidoConfigService.updateMeriendasLibresContenido(contenido);
    }
    async getTardesTePromoOliviaContenido() {
        return this.contenidoConfigService.getTardesTePromoOliviaContenido();
    }
    async updateTardesTePromoOliviaContenido(contenido) {
        return this.contenidoConfigService.updateTardesTePromoOliviaContenido(contenido);
    }
    async getTardesTePromoBasicaContenido() {
        return this.contenidoConfigService.getTardesTePromoBasicaContenido();
    }
    async updateTardesTePromoBasicaContenido(contenido) {
        return this.contenidoConfigService.updateTardesTePromoBasicaContenido(contenido);
    }
    async findOne(id) {
        return this.contenidoConfigService.findOne(+id);
    }
    async update(id, dto) {
        return this.contenidoConfigService.update(+id, dto);
    }
    async remove(id) {
        return this.contenidoConfigService.remove(+id);
    }
};
exports.ContenidoConfigController = ContenidoConfigController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contenido_config_dto_1.CreateContenidoConfigDto]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('meriendas-libres/contenido'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "getMeriendasLibresContenido", null);
__decorate([
    (0, common_1.Patch)('meriendas-libres/contenido'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "updateMeriendasLibresContenido", null);
__decorate([
    (0, common_1.Get)('tardes-te/promo-olivia/contenido'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "getTardesTePromoOliviaContenido", null);
__decorate([
    (0, common_1.Patch)('tardes-te/promo-olivia/contenido'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "updateTardesTePromoOliviaContenido", null);
__decorate([
    (0, common_1.Get)('tardes-te/promo-basica/contenido'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "getTardesTePromoBasicaContenido", null);
__decorate([
    (0, common_1.Patch)('tardes-te/promo-basica/contenido'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "updateTardesTePromoBasicaContenido", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_contenido_config_dto_1.UpdateContenidoConfigDto]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContenidoConfigController.prototype, "remove", null);
exports.ContenidoConfigController = ContenidoConfigController = __decorate([
    (0, common_1.Controller)('contenido-config'),
    __metadata("design:paramtypes", [contenido_config_service_1.ContenidoConfigService])
], ContenidoConfigController);
//# sourceMappingURL=contenido-config.controller.js.map
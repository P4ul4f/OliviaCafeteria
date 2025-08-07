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
exports.PreciosConfigController = void 0;
const common_1 = require("@nestjs/common");
const precios_config_service_1 = require("./precios-config.service");
let PreciosConfigController = class PreciosConfigController {
    preciosConfigService;
    constructor(preciosConfigService) {
        this.preciosConfigService = preciosConfigService;
    }
    getAllConfig() {
        return this.preciosConfigService.getAllConfig();
    }
    getMeriendaLibrePrice() {
        return this.preciosConfigService.getMeriendaLibrePrice();
    }
    async getCuposMeriendasLibres() {
        return this.preciosConfigService.getCuposMeriendasLibres();
    }
    updateMeriendaLibrePrice(precio) {
        return this.preciosConfigService.updateMeriendaLibrePrice(precio);
    }
    async updateCuposMeriendasLibres(cupos) {
        return this.preciosConfigService.updateCuposMeriendasLibres(cupos);
    }
    async getPrecioPromoOlivia() {
        return this.preciosConfigService.getPrecioPromoOlivia();
    }
    async updatePrecioPromoOlivia(precio) {
        return this.preciosConfigService.updatePrecioPromoOlivia(precio);
    }
    async getPrecioPromoBasica() {
        return this.preciosConfigService.getPrecioPromoBasica();
    }
    async updatePrecioPromoBasica(precio) {
        return this.preciosConfigService.updatePrecioPromoBasica(precio);
    }
    async getCuposTardesDeTe() {
        return this.preciosConfigService.getCuposTardesDeTe();
    }
    async updateCuposTardesDeTe(cupos) {
        return this.preciosConfigService.updateCuposTardesDeTe(cupos);
    }
    async getPrecioALaCarta() {
        return this.preciosConfigService.getPrecioALaCarta();
    }
    async updatePrecioALaCarta(precio) {
        return this.preciosConfigService.updatePrecioALaCarta(precio);
    }
    async getPrecioTardeDeTe() {
        return this.preciosConfigService.getPrecioTardeDeTe();
    }
    async updatePrecioTardeDeTe(precio) {
        return this.preciosConfigService.updatePrecioTardeDeTe(precio);
    }
};
exports.PreciosConfigController = PreciosConfigController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreciosConfigController.prototype, "getAllConfig", null);
__decorate([
    (0, common_1.Get)('merienda-libre'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getMeriendaLibrePrice", null);
__decorate([
    (0, common_1.Get)('merienda-libre/cupos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getCuposMeriendasLibres", null);
__decorate([
    (0, common_1.Patch)('merienda-libre'),
    __param(0, (0, common_1.Body)('precio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PreciosConfigController.prototype, "updateMeriendaLibrePrice", null);
__decorate([
    (0, common_1.Patch)('merienda-libre/cupos'),
    __param(0, (0, common_1.Body)('cupos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "updateCuposMeriendasLibres", null);
__decorate([
    (0, common_1.Get)('tarde-te/precio-promo-olivia'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getPrecioPromoOlivia", null);
__decorate([
    (0, common_1.Patch)('tarde-te/precio-promo-olivia'),
    __param(0, (0, common_1.Body)('precio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "updatePrecioPromoOlivia", null);
__decorate([
    (0, common_1.Get)('tarde-te/precio-promo-basica'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getPrecioPromoBasica", null);
__decorate([
    (0, common_1.Patch)('tarde-te/precio-promo-basica'),
    __param(0, (0, common_1.Body)('precio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "updatePrecioPromoBasica", null);
__decorate([
    (0, common_1.Get)('tarde-te/cupos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getCuposTardesDeTe", null);
__decorate([
    (0, common_1.Patch)('tarde-te/cupos'),
    __param(0, (0, common_1.Body)('cupos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "updateCuposTardesDeTe", null);
__decorate([
    (0, common_1.Get)('a-la-carta/precio'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getPrecioALaCarta", null);
__decorate([
    (0, common_1.Patch)('a-la-carta/precio'),
    __param(0, (0, common_1.Body)('precio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "updatePrecioALaCarta", null);
__decorate([
    (0, common_1.Get)('tarde-te/precio'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "getPrecioTardeDeTe", null);
__decorate([
    (0, common_1.Patch)('tarde-te/precio'),
    __param(0, (0, common_1.Body)('precio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreciosConfigController.prototype, "updatePrecioTardeDeTe", null);
exports.PreciosConfigController = PreciosConfigController = __decorate([
    (0, common_1.Controller)('precios-config'),
    __metadata("design:paramtypes", [precios_config_service_1.PreciosConfigService])
], PreciosConfigController);
//# sourceMappingURL=precios-config.controller.js.map
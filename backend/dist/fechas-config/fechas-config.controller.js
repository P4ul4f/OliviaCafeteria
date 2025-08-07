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
exports.FechasConfigController = void 0;
const common_1 = require("@nestjs/common");
const fechas_config_service_1 = require("./fechas-config.service");
let FechasConfigController = class FechasConfigController {
    fechasConfigService;
    constructor(fechasConfigService) {
        this.fechasConfigService = fechasConfigService;
    }
    findAll() {
        return this.fechasConfigService.findAll();
    }
    findOne(id) {
        return this.fechasConfigService.findOne(id);
    }
    create(data) {
        return this.fechasConfigService.create(data);
    }
    update(id, data) {
        return this.fechasConfigService.update(id, data);
    }
    remove(id) {
        return this.fechasConfigService.remove(id);
    }
};
exports.FechasConfigController = FechasConfigController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FechasConfigController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FechasConfigController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FechasConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FechasConfigController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FechasConfigController.prototype, "remove", null);
exports.FechasConfigController = FechasConfigController = __decorate([
    (0, common_1.Controller)('fechas-config'),
    __metadata("design:paramtypes", [fechas_config_service_1.FechasConfigService])
], FechasConfigController);
//# sourceMappingURL=fechas-config.controller.js.map
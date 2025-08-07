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
exports.AdministradorController = void 0;
const common_1 = require("@nestjs/common");
const administrador_service_1 = require("./administrador.service");
const create_administrador_dto_1 = require("./dto/create-administrador.dto");
const update_administrador_dto_1 = require("./dto/update-administrador.dto");
let AdministradorController = class AdministradorController {
    administradorService;
    constructor(administradorService) {
        this.administradorService = administradorService;
    }
    create(dto) {
        return this.administradorService.create(dto);
    }
    findAll() {
        return this.administradorService.findAll();
    }
    findOne(id) {
        return this.administradorService.findOne(Number(id));
    }
    update(id, dto) {
        return this.administradorService.update(Number(id), dto);
    }
    remove(id) {
        return this.administradorService.remove(Number(id));
    }
};
exports.AdministradorController = AdministradorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_administrador_dto_1.CreateAdministradorDto]),
    __metadata("design:returntype", void 0)
], AdministradorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdministradorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministradorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_administrador_dto_1.UpdateAdministradorDto]),
    __metadata("design:returntype", void 0)
], AdministradorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministradorController.prototype, "remove", null);
exports.AdministradorController = AdministradorController = __decorate([
    (0, common_1.Controller)('administrador'),
    __metadata("design:paramtypes", [administrador_service_1.AdministradorService])
], AdministradorController);
//# sourceMappingURL=administrador.controller.js.map
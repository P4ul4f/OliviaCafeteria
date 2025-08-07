"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreciosConfigModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const precios_config_entity_1 = require("./precios-config.entity");
const precios_config_service_1 = require("./precios-config.service");
const precios_config_controller_1 = require("./precios-config.controller");
let PreciosConfigModule = class PreciosConfigModule {
};
exports.PreciosConfigModule = PreciosConfigModule;
exports.PreciosConfigModule = PreciosConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([precios_config_entity_1.PreciosConfig])],
        providers: [precios_config_service_1.PreciosConfigService],
        controllers: [precios_config_controller_1.PreciosConfigController],
        exports: [precios_config_service_1.PreciosConfigService],
    })
], PreciosConfigModule);
//# sourceMappingURL=precios-config.module.js.map
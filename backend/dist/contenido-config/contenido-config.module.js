"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContenidoConfigModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contenido_config_service_1 = require("./contenido-config.service");
const contenido_config_controller_1 = require("./contenido-config.controller");
const contenido_config_entity_1 = require("./contenido-config.entity");
let ContenidoConfigModule = class ContenidoConfigModule {
};
exports.ContenidoConfigModule = ContenidoConfigModule;
exports.ContenidoConfigModule = ContenidoConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([contenido_config_entity_1.ContenidoConfig])],
        controllers: [contenido_config_controller_1.ContenidoConfigController],
        providers: [contenido_config_service_1.ContenidoConfigService],
        exports: [contenido_config_service_1.ContenidoConfigService],
    })
], ContenidoConfigModule);
//# sourceMappingURL=contenido-config.module.js.map
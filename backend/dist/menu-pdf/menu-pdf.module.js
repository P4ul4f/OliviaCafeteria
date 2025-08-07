"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuPdfModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const menu_pdf_entity_1 = require("./menu-pdf.entity");
const menu_pdf_controller_1 = require("./menu-pdf.controller");
let MenuPdfModule = class MenuPdfModule {
};
exports.MenuPdfModule = MenuPdfModule;
exports.MenuPdfModule = MenuPdfModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([menu_pdf_entity_1.MenuPdf])],
        controllers: [menu_pdf_controller_1.MenuPdfController],
    })
], MenuPdfModule);
//# sourceMappingURL=menu-pdf.module.js.map
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
exports.MenuPdfController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_pdf_entity_1 = require("./menu-pdf.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const fs = require("fs");
const path = require("path");
let MenuPdfController = class MenuPdfController {
    menuPdfRepo;
    constructor(menuPdfRepo) {
        this.menuPdfRepo = menuPdfRepo;
        const uploadsDir = path.join(process.cwd(), 'uploads-files');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
    }
    async uploadPdf(file) {
        if (!file) {
            return { success: false, message: 'No se subió ningún archivo' };
        }
        console.log('📤 Iniciando upload de PDF:', file.originalname);
        console.log('📁 Archivo recibido:', file);
        try {
            try {
                await this.menuPdfRepo.query('SELECT "contenidoArchivo" FROM "menu_pdf" LIMIT 1');
            }
            catch (columnError) {
                console.log('⚠️ Columna contenidoArchivo no existe, agregando...');
                await this.menuPdfRepo.query('ALTER TABLE "menu_pdf" ADD COLUMN "contenidoArchivo" bytea');
                console.log('✅ Columna contenidoArchivo agregada');
            }
            const fileContent = fs.readFileSync(file.path);
            console.log('📄 Contenido del archivo leído:', fileContent.length, 'bytes');
            let pdf = await this.menuPdfRepo.findOne({
                where: { clave: 'carta_principal' }
            });
            if (pdf) {
                console.log('🔄 Actualizando PDF existente en la base de datos');
                pdf.nombreArchivo = file.filename;
                pdf.rutaArchivo = `/uploads-files/${file.filename}`;
                pdf.tamanoArchivo = file.size;
                pdf.descripcion = 'Carta principal del café';
                pdf.activo = true;
                pdf.contenidoArchivo = fileContent;
                await this.menuPdfRepo.save(pdf);
                console.log('✅ PDF actualizado en la base de datos con contenido');
            }
            else {
                console.log('🆕 Creando nueva entrada de PDF en la base de datos');
                pdf = this.menuPdfRepo.create({
                    clave: 'carta_principal',
                    nombreArchivo: file.filename,
                    rutaArchivo: `/uploads-files/${file.filename}`,
                    tamanoArchivo: file.size,
                    descripcion: 'Carta principal del café',
                    activo: true,
                    contenidoArchivo: fileContent,
                });
                await this.menuPdfRepo.save(pdf);
                console.log('✅ PDF guardado en la base de datos con contenido');
            }
            fs.unlinkSync(file.path);
            console.log('🗑️ Archivo temporal eliminado');
            return { success: true, message: 'PDF subido correctamente', pdf };
        }
        catch (error) {
            console.error('❌ Error en uploadPdf:', error);
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
                console.log('🗑️ Archivo temporal eliminado debido al error');
            }
            throw error;
        }
    }
    async getPdfInfo() {
        const pdf = await this.menuPdfRepo.findOne({ where: { clave: 'carta_principal', activo: true } });
        return pdf || {};
    }
    async downloadPdf(res) {
        try {
            try {
                await this.menuPdfRepo.query('SELECT "contenidoArchivo" FROM "menu_pdf" LIMIT 1');
            }
            catch (columnError) {
                console.log('⚠️ Columna contenidoArchivo no existe, agregando...');
                await this.menuPdfRepo.query('ALTER TABLE "menu_pdf" ADD COLUMN "contenidoArchivo" bytea');
                console.log('✅ Columna contenidoArchivo agregada');
            }
            const allPdfs = await this.menuPdfRepo.find({
                where: { clave: 'carta_principal' },
                order: { fechaCreacion: 'DESC' }
            });
            if (allPdfs.length > 1) {
                console.log(`🧹 Limpiando ${allPdfs.length - 1} entradas duplicadas`);
                for (let i = 1; i < allPdfs.length; i++) {
                    await this.menuPdfRepo.update({ id: allPdfs[i].id }, { activo: false });
                }
            }
            const pdf = await this.menuPdfRepo.findOne({ where: { clave: 'carta_principal', activo: true } });
            if (!pdf) {
                console.log('❌ No hay PDF activo en la base de datos');
                return res.status(404).json({ message: 'No hay carta PDF disponible' });
            }
            console.log('📄 PDF encontrado en BD:', pdf);
            if (!pdf.contenidoArchivo) {
                console.log('❌ PDF no tiene contenido almacenado en la BD');
                return res.status(404).json({ message: 'PDF sin contenido disponible' });
            }
            console.log('✅ PDF con contenido encontrado, enviando desde BD...');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${pdf.nombreArchivo}"`);
            res.setHeader('Content-Length', pdf.contenidoArchivo.length.toString());
            res.send(pdf.contenidoArchivo);
        }
        catch (error) {
            console.error('❌ Error en downloadPdf:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};
exports.MenuPdfController = MenuPdfController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadsDir = path.join(process.cwd(), 'uploads-files');
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
                cb(null, uploadsDir);
            },
            filename: (req, file, cb) => {
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `carta-olivia${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Solo se permiten archivos PDF'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuPdfController.prototype, "uploadPdf", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenuPdfController.prototype, "getPdfInfo", null);
__decorate([
    (0, common_1.Get)('download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuPdfController.prototype, "downloadPdf", null);
exports.MenuPdfController = MenuPdfController = __decorate([
    (0, common_1.Controller)('menu-pdf'),
    __param(0, (0, typeorm_1.InjectRepository)(menu_pdf_entity_1.MenuPdf)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuPdfController);
//# sourceMappingURL=menu-pdf.controller.js.map
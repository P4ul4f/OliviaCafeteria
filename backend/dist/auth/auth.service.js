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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const administrador_entity_1 = require("../administrador/administrador.entity");
let AuthService = AuthService_1 = class AuthService {
    administradorRepository;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(administradorRepository, jwtService, configService) {
        this.administradorRepository = administradorRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    async login(loginDto) {
        const { usuario, contrasena } = loginDto;
        const admin = await this.administradorRepository.findOne({
            where: { usuario },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        let isValidPassword = false;
        try {
            isValidPassword = await this.comparePassword(contrasena, admin.contrasena);
        }
        catch (error) {
            isValidPassword = contrasena === admin.contrasena;
        }
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = { sub: admin.id, usuario: admin.usuario };
        const access_token = this.jwtService.sign(payload, {
            expiresIn: '30d',
        });
        this.logger.log(`Login exitoso para usuario: ${usuario}`);
        return {
            access_token,
            expiresIn: '30 días',
            admin: {
                id: admin.id,
                usuario: admin.usuario,
            }
        };
    }
    async changePassword(adminId, changePasswordDto) {
        const { contrasenaActual, contrasenaNueva, confirmarContrasena } = changePasswordDto;
        if (contrasenaNueva !== confirmarContrasena) {
            throw new common_1.BadRequestException('La nueva contraseña y la confirmación no coinciden');
        }
        const admin = await this.administradorRepository.findOne({
            where: { id: adminId },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Administrador no encontrado');
        }
        let isValidPassword = false;
        try {
            isValidPassword = await this.comparePassword(contrasenaActual, admin.contrasena);
        }
        catch (error) {
            isValidPassword = contrasenaActual === admin.contrasena;
        }
        if (!isValidPassword) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        const nuevaContrasenaHash = await this.hashPassword(contrasenaNueva);
        await this.administradorRepository.update(admin.id, {
            contrasena: nuevaContrasenaHash,
        });
        this.logger.log(`Contraseña cambiada exitosamente para usuario: ${admin.usuario}`);
        return {
            message: 'Contraseña actualizada exitosamente'
        };
    }
    async getProfile(adminId) {
        const admin = await this.administradorRepository.findOne({
            where: { id: adminId },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Administrador no encontrado');
        }
        return {
            id: admin.id,
            usuario: admin.usuario,
        };
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const admin = await this.administradorRepository.findOne({
                where: { id: payload.sub, usuario: payload.usuario },
            });
            return !!admin;
        }
        catch (error) {
            return false;
        }
    }
    async createAdmin(userData) {
        const { usuario, contrasena } = userData;
        const existingAdmin = await this.administradorRepository.findOne({
            where: { usuario },
        });
        if (existingAdmin) {
            throw new common_1.BadRequestException('El usuario ya existe');
        }
        const contrasenaHash = await this.hashPassword(contrasena);
        const admin = this.administradorRepository.create({
            usuario,
            contrasena: contrasenaHash,
        });
        return this.administradorRepository.save(admin);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(administrador_entity_1.Administrador)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
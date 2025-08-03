import { Injectable, BadRequestException, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Administrador } from '../administrador/administrador.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; expiresIn: string; admin: any }> {
    const { usuario, contrasena } = loginDto;

    // Buscar administrador por usuario
    const admin = await this.administradorRepository.findOne({
      where: { usuario },
    });

    if (!admin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña (podría estar hasheada o en texto plano)
    let isValidPassword = false;
    
    // Primero intentar con hash
    try {
      isValidPassword = await this.comparePassword(contrasena, admin.contrasena);
    } catch (error) {
      // Si falla el hash, comparar directamente (texto plano)
      isValidPassword = contrasena === admin.contrasena;
    }

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT token (30 días)
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

  async changePassword(adminId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { contrasenaActual, contrasenaNueva, confirmarContrasena } = changePasswordDto;

    // Verificar que las contraseñas nuevas coincidan
    if (contrasenaNueva !== confirmarContrasena) {
      throw new BadRequestException('La nueva contraseña y la confirmación no coinciden');
    }

    // Buscar administrador
    const admin = await this.administradorRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }

    // Verificar contraseña actual (podría estar hasheada o en texto plano)
    let isValidPassword = false;
    
    try {
      isValidPassword = await this.comparePassword(contrasenaActual, admin.contrasena);
    } catch (error) {
      isValidPassword = contrasenaActual === admin.contrasena;
    }

    if (!isValidPassword) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const nuevaContrasenaHash = await this.hashPassword(contrasenaNueva);

    // Actualizar contraseña
    await this.administradorRepository.update(admin.id, {
      contrasena: nuevaContrasenaHash,
    });

    this.logger.log(`Contraseña cambiada exitosamente para usuario: ${admin.usuario}`);

    return {
      message: 'Contraseña actualizada exitosamente'
    };
  }

  async getProfile(adminId: number): Promise<any> {
    const admin = await this.administradorRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }

    return {
      id: admin.id,
      usuario: admin.usuario,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      const admin = await this.administradorRepository.findOne({
        where: { id: payload.sub, usuario: payload.usuario },
      });
      return !!admin;
    } catch (error) {
      return false;
    }
  }

  // Método para crear administrador (solo para seeds/desarrollo)
  async createAdmin(userData: {
    usuario: string;
    contrasena: string;
  }): Promise<Administrador> {
    const { usuario, contrasena } = userData;

    // Verificar que no exista el usuario
    const existingAdmin = await this.administradorRepository.findOne({
      where: { usuario },
    });

    if (existingAdmin) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Crear admin con contraseña hasheada
    const contrasenaHash = await this.hashPassword(contrasena);
    
    const admin = this.administradorRepository.create({
      usuario,
      contrasena: contrasenaHash,
    });

    return this.administradorRepository.save(admin);
  }
} 
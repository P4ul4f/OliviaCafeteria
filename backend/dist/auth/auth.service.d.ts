import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Administrador } from '../administrador/administrador.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private administradorRepository;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(administradorRepository: Repository<Administrador>, jwtService: JwtService, configService: ConfigService);
    private hashPassword;
    private comparePassword;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        expiresIn: string;
        admin: any;
    }>;
    changePassword(adminId: number, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getProfile(adminId: number): Promise<any>;
    validateToken(token: string): Promise<boolean>;
    createAdmin(userData: {
        usuario: string;
        contrasena: string;
    }): Promise<Administrador>;
}

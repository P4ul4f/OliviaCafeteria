import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Administrador } from '../administrador/administrador.entity';

export interface JwtPayload {
  sub: number;
  usuario: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'olivia-cafe-super-secret-key'),
    });
  }

  async validate(payload: JwtPayload) {
    const admin = await this.administradorRepository.findOne({
      where: { id: payload.sub, usuario: payload.usuario },
    });

    if (!admin) {
      throw new UnauthorizedException('Token inválido o administrador inactivo');
    }

    return {
      id: admin.id,
      usuario: admin.usuario,
    };
  }
} 
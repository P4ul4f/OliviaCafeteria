import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { Administrador } from '../administrador/administrador.entity';
export interface JwtPayload {
    sub: number;
    usuario: string;
    iat: number;
    exp: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private administradorRepository;
    constructor(configService: ConfigService, administradorRepository: Repository<Administrador>);
    validate(payload: JwtPayload): Promise<{
        id: number;
        usuario: string;
    }>;
}
export {};

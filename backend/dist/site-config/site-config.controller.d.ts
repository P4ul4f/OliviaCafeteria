import { SiteConfigService } from './site-config.service';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';
export declare class SiteConfigController {
    private readonly siteConfigService;
    constructor(siteConfigService: SiteConfigService);
    getPublicConfig(): Promise<{
        telefono: string;
        direccion: string;
        email: string;
        horarios: {
            lunes: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            martes: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            miercoles: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            jueves: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            viernes: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            sabado: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            domingo: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
        };
    }>;
    getHorarios(): Promise<any>;
    getContacto(): Promise<{
        telefono: string;
        direccion: string;
        email: string;
    }>;
    getAdminConfig(): Promise<import("./site-config.entity").SiteConfig>;
    updateConfig(updateDto: UpdateSiteConfigDto): Promise<{
        message: string;
        data: import("./site-config.entity").SiteConfig;
    }>;
    updateHorarios(horarios: any): Promise<{
        message: string;
        data: {
            lunes: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            martes: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            miercoles: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            jueves: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            viernes: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            sabado: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
            domingo: {
                abierto: boolean;
                manana: string;
                noche: string;
            };
        };
    }>;
}

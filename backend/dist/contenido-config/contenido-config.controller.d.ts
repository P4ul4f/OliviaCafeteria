import { ContenidoConfigService } from './contenido-config.service';
import { CreateContenidoConfigDto, UpdateContenidoConfigDto } from './dto/create-contenido-config.dto';
export declare class ContenidoConfigController {
    private readonly contenidoConfigService;
    constructor(contenidoConfigService: ContenidoConfigService);
    create(dto: CreateContenidoConfigDto): Promise<import("./contenido-config.entity").ContenidoConfig>;
    findAll(): Promise<{
        message: string;
    }>;
    getMeriendasLibresContenido(): Promise<any>;
    updateMeriendasLibresContenido(contenido: any): Promise<import("./contenido-config.entity").ContenidoConfig>;
    getTardesTePromoOliviaContenido(): Promise<any>;
    updateTardesTePromoOliviaContenido(contenido: any): Promise<import("./contenido-config.entity").ContenidoConfig>;
    getTardesTePromoBasicaContenido(): Promise<any>;
    updateTardesTePromoBasicaContenido(contenido: any): Promise<import("./contenido-config.entity").ContenidoConfig>;
    findOne(id: string): Promise<import("./contenido-config.entity").ContenidoConfig | null>;
    update(id: string, dto: UpdateContenidoConfigDto): Promise<import("./contenido-config.entity").ContenidoConfig | null>;
    remove(id: string): Promise<boolean>;
}

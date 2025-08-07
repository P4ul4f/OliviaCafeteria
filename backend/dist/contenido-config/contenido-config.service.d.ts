import { Repository } from 'typeorm';
import { ContenidoConfig } from './contenido-config.entity';
import { CreateContenidoConfigDto, UpdateContenidoConfigDto } from './dto/create-contenido-config.dto';
export declare class ContenidoConfigService {
    private contenidoConfigRepository;
    constructor(contenidoConfigRepository: Repository<ContenidoConfig>);
    create(dto: CreateContenidoConfigDto): Promise<ContenidoConfig>;
    findAll(): Promise<ContenidoConfig[]>;
    findOne(id: number): Promise<ContenidoConfig | null>;
    findByClave(clave: string): Promise<ContenidoConfig | null>;
    update(id: number, dto: UpdateContenidoConfigDto): Promise<ContenidoConfig | null>;
    updateByClave(clave: string, dto: UpdateContenidoConfigDto): Promise<ContenidoConfig | null>;
    remove(id: number): Promise<boolean>;
    getMeriendasLibresContenido(): Promise<any>;
    updateMeriendasLibresContenido(contenido: any): Promise<ContenidoConfig>;
    getTardesTePromoOliviaContenido(): Promise<any>;
    updateTardesTePromoOliviaContenido(contenido: any): Promise<ContenidoConfig>;
    getTardesTePromoBasicaContenido(): Promise<any>;
    updateTardesTePromoBasicaContenido(contenido: any): Promise<ContenidoConfig>;
}

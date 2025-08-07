import { FechasConfigService } from './fechas-config.service';
import { FechasConfig } from './fechas-config.entity';
export declare class FechasConfigController {
    private readonly fechasConfigService;
    constructor(fechasConfigService: FechasConfigService);
    findAll(): Promise<FechasConfig[]>;
    findOne(id: number): Promise<FechasConfig>;
    create(data: Partial<FechasConfig>): Promise<FechasConfig>;
    update(id: number, data: Partial<FechasConfig>): Promise<FechasConfig>;
    remove(id: number): Promise<void>;
}

import { FechasConfigService } from './fechas-config.service';
import { FechasConfig } from './fechas-config.entity';
import { CreateFechasConfigDto } from './dto/create-fechas-config.dto';
export declare class FechasConfigController {
    private readonly fechasConfigService;
    constructor(fechasConfigService: FechasConfigService);
    findAll(): Promise<FechasConfig[]>;
    findOne(id: number): Promise<FechasConfig>;
    create(data: CreateFechasConfigDto): Promise<FechasConfig>;
    update(id: number, data: Partial<CreateFechasConfigDto>): Promise<FechasConfig>;
    remove(id: number): Promise<void>;
}

import { Repository } from 'typeorm';
import { FechasConfig } from './fechas-config.entity';
import { CreateFechasConfigDto } from './dto/create-fechas-config.dto';
export declare class FechasConfigService {
    private fechasConfigRepository;
    constructor(fechasConfigRepository: Repository<FechasConfig>);
    create(createFechasConfigDto: CreateFechasConfigDto): Promise<FechasConfig>;
    findAll(): Promise<FechasConfig[]>;
    findOne(id: number): Promise<FechasConfig>;
    update(id: number, updateFechasConfigDto: Partial<CreateFechasConfigDto>): Promise<FechasConfig>;
    remove(id: number): Promise<void>;
    findByTipoReserva(tipoReserva: string): Promise<FechasConfig[]>;
}

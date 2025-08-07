import { Repository } from 'typeorm';
import { FechasConfig } from './fechas-config.entity';
export declare class FechasConfigService {
    private readonly fechasConfigRepo;
    constructor(fechasConfigRepo: Repository<FechasConfig>);
    findAll(): Promise<FechasConfig[]>;
    findOne(id: number): Promise<FechasConfig>;
    create(data: Partial<FechasConfig>): Promise<FechasConfig>;
    update(id: number, data: Partial<FechasConfig>): Promise<FechasConfig>;
    remove(id: number): Promise<void>;
}

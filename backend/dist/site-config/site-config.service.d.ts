import { Repository } from 'typeorm';
import { SiteConfig } from './site-config.entity';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';
export declare class SiteConfigService {
    private siteConfigRepository;
    constructor(siteConfigRepository: Repository<SiteConfig>);
    getMainConfig(): Promise<SiteConfig>;
    updateMainConfig(updateDto: UpdateSiteConfigDto): Promise<SiteConfig>;
    getHorarios(): Promise<any>;
    getContactInfo(): Promise<{
        telefono: string;
        direccion: string;
        email: string;
    }>;
}

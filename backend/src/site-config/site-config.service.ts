import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteConfig } from './site-config.entity';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';

@Injectable()
export class SiteConfigService {
  constructor(
    @InjectRepository(SiteConfig)
    private siteConfigRepository: Repository<SiteConfig>,
  ) {}

  // Obtener la configuración principal del sitio
  async getMainConfig(): Promise<SiteConfig> {
    const config = await this.siteConfigRepository.findOne({
      where: { clave: 'info_general' }
    });

    if (!config) {
      throw new NotFoundException('Configuración del sitio no encontrada');
    }

    return config;
  }

  // Actualizar la configuración del sitio (para admin)
  async updateMainConfig(updateDto: UpdateSiteConfigDto): Promise<SiteConfig> {
    const config = await this.getMainConfig();
    
    Object.assign(config, updateDto);
    return this.siteConfigRepository.save(config);
  }

  // Obtener solo los horarios (método auxiliar)
  async getHorarios(): Promise<any> {
    const config = await this.getMainConfig();
    return config.horarios;
  }

  // Obtener información de contacto (método auxiliar)
  async getContactInfo(): Promise<{ telefono: string; direccion: string; email: string }> {
    const config = await this.getMainConfig();
    return {
      telefono: config.telefono,
      direccion: config.direccion,
      email: config.email
    };
  }
} 
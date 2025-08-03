import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContenidoConfig } from './contenido-config.entity';
import { CreateContenidoConfigDto, UpdateContenidoConfigDto } from './dto/create-contenido-config.dto';

@Injectable()
export class ContenidoConfigService {
  constructor(
    @InjectRepository(ContenidoConfig)
    private contenidoConfigRepository: Repository<ContenidoConfig>,
  ) {}

  async create(dto: CreateContenidoConfigDto): Promise<ContenidoConfig> {
    const contenidoConfig = this.contenidoConfigRepository.create(dto);
    return this.contenidoConfigRepository.save(contenidoConfig);
  }

  async findAll(): Promise<ContenidoConfig[]> {
    return this.contenidoConfigRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ContenidoConfig | null> {
    return this.contenidoConfigRepository.findOne({ where: { id } });
  }

  async findByClave(clave: string): Promise<ContenidoConfig | null> {
    return this.contenidoConfigRepository.findOne({ where: { clave } });
  }

  async update(id: number, dto: UpdateContenidoConfigDto): Promise<ContenidoConfig | null> {
    const contenidoConfig = await this.findOne(id);
    if (contenidoConfig) {
      Object.assign(contenidoConfig, dto);
      return this.contenidoConfigRepository.save(contenidoConfig);
    }
    return null;
  }

  async updateByClave(clave: string, dto: UpdateContenidoConfigDto): Promise<ContenidoConfig | null> {
    const contenidoConfig = await this.findByClave(clave);
    if (contenidoConfig) {
      Object.assign(contenidoConfig, dto);
      return this.contenidoConfigRepository.save(contenidoConfig);
    }
    return null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.contenidoConfigRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Métodos específicos para cada tipo de contenido
  async getMeriendasLibresContenido(): Promise<any> {
    const config = await this.findByClave('meriendas_libres_contenido');
    return config ? config.contenido : null;
  }

  async updateMeriendasLibresContenido(contenido: any): Promise<ContenidoConfig> {
    const config = await this.findByClave('meriendas_libres_contenido');
    if (config) {
      config.contenido = contenido;
      return this.contenidoConfigRepository.save(config);
    } else {
      return this.create({
        clave: 'meriendas_libres_contenido',
        contenido,
        descripcion: 'Contenido configurable de Meriendas Libres'
      });
    }
  }

  async getTardesTePromoOliviaContenido(): Promise<any> {
    const config = await this.findByClave('tardes_te_promo_olivia_contenido');
    return config ? config.contenido : null;
  }

  async updateTardesTePromoOliviaContenido(contenido: any): Promise<ContenidoConfig> {
    const config = await this.findByClave('tardes_te_promo_olivia_contenido');
    if (config) {
      config.contenido = contenido;
      return this.contenidoConfigRepository.save(config);
    } else {
      return this.create({
        clave: 'tardes_te_promo_olivia_contenido',
        contenido,
        descripcion: 'Contenido configurable de Tardes de Té - Promo Olivia'
      });
    }
  }

  async getTardesTePromoBasicaContenido(): Promise<any> {
    const config = await this.findByClave('tardes_te_promo_basica_contenido');
    return config ? config.contenido : null;
  }

  async updateTardesTePromoBasicaContenido(contenido: any): Promise<ContenidoConfig> {
    const config = await this.findByClave('tardes_te_promo_basica_contenido');
    if (config) {
      config.contenido = contenido;
      return this.contenidoConfigRepository.save(config);
    } else {
      return this.create({
        clave: 'tardes_te_promo_basica_contenido',
        contenido,
        descripcion: 'Contenido configurable de Tardes de Té - Promo Básica'
      });
    }
  }
} 
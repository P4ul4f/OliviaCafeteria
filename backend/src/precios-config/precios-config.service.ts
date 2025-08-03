import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreciosConfig } from './precios-config.entity';

@Injectable()
export class PreciosConfigService {
  constructor(
    @InjectRepository(PreciosConfig)
    private readonly preciosConfigRepo: Repository<PreciosConfig>,
  ) {}

  async getMeriendaLibrePrice(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) throw new NotFoundException('Configuración de precios no encontrada');
    return Number(config.meriendaLibre);
  }

  async getAllConfig(): Promise<PreciosConfig> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) throw new NotFoundException('Configuración de precios no encontrada');
    return config;
  }

  async getCuposMeriendasLibres(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) throw new NotFoundException('Configuración de precios no encontrada');
    return config.cuposMeriendasLibres;
  }

  async updateCuposMeriendasLibres(cupos: number): Promise<any> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) {
      throw new Error('Configuración de precios no encontrada');
    }
    config.cuposMeriendasLibres = cupos;
    return this.preciosConfigRepo.save(config);
  }

  async updateMeriendaLibrePrice(newPrice: number): Promise<PreciosConfig> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) throw new NotFoundException('Configuración de precios no encontrada');
    config.meriendaLibre = newPrice;
    return this.preciosConfigRepo.save(config);
  }

  async getPrecioPromoOlivia(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    return config ? config.promoOlivia : 0;
  }

  async updatePrecioPromoOlivia(precio: number): Promise<any> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) {
      throw new Error('Configuración de precios no encontrada');
    }
    config.promoOlivia = precio;
    return this.preciosConfigRepo.save(config);
  }

  async getPrecioPromoBasica(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    return config ? config.promoBasica : 0;
  }

  async updatePrecioPromoBasica(precio: number): Promise<any> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) {
      throw new Error('Configuración de precios no encontrada');
    }
    config.promoBasica = precio;
    return this.preciosConfigRepo.save(config);
  }

  async getCuposTardesDeTe(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    return config ? config.cuposTardesDeTe : 65;
  }

  async updateCuposTardesDeTe(cupos: number): Promise<any> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) {
      throw new Error('Configuración de precios no encontrada');
    }
    config.cuposTardesDeTe = cupos;
    return this.preciosConfigRepo.save(config);
  }

  async getPrecioALaCarta(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    return config ? config.aLaCarta : 5000;
  }

  async updatePrecioALaCarta(precio: number): Promise<any> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) {
      throw new Error('Configuración de precios no encontrada');
    }
    config.aLaCarta = precio;
    return this.preciosConfigRepo.save(config);
  }

  async getPrecioTardeDeTe(): Promise<number> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    return config ? config.tardeDeTe : 0;
  }

  async updatePrecioTardeDeTe(precio: number): Promise<any> {
    const config = await this.preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
    if (!config) {
      throw new Error('Configuración de precios no encontrada');
    }
    config.tardeDeTe = precio;
    return this.preciosConfigRepo.save(config);
  }
} 
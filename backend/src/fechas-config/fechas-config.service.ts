import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FechasConfig } from './fechas-config.entity';
import { CreateFechasConfigDto } from './dto/create-fechas-config.dto';

@Injectable()
export class FechasConfigService {
  constructor(
    @InjectRepository(FechasConfig)
    private fechasConfigRepository: Repository<FechasConfig>,
  ) {}

  async create(createFechasConfigDto: CreateFechasConfigDto): Promise<FechasConfig> {
    const fechasConfig = this.fechasConfigRepository.create(createFechasConfigDto);
    return await this.fechasConfigRepository.save(fechasConfig);
  }

  async findAll(): Promise<FechasConfig[]> {
    return await this.fechasConfigRepository.find({ order: { fecha: 'ASC' } });
  }

  async findOne(id: number): Promise<FechasConfig> {
    const fechasConfig = await this.fechasConfigRepository.findOne({ where: { id } });
    if (!fechasConfig) {
      throw new NotFoundException(`FechasConfig with ID ${id} not found`);
    }
    return fechasConfig;
  }

  async update(id: number, updateFechasConfigDto: Partial<CreateFechasConfigDto>): Promise<FechasConfig> {
    const fechasConfig = await this.findOne(id);
    Object.assign(fechasConfig, updateFechasConfigDto);
    return await this.fechasConfigRepository.save(fechasConfig);
  }

  async remove(id: number): Promise<void> {
    const fechasConfig = await this.findOne(id);
    await this.fechasConfigRepository.remove(fechasConfig);
  }

  async findByTipoReserva(tipoReserva: string): Promise<FechasConfig[]> {
    return await this.fechasConfigRepository.find({
      where: { tipoReserva, activo: true },
      order: { fecha: 'ASC' }
    });
  }
} 
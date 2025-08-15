import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const fechasConfig = this.fechasConfigRepository.create(createFechasConfigDto);
      return await this.fechasConfigRepository.save(fechasConfig);
    } catch (error) {
      console.error('❌ Error creating FechasConfig:', error);
      throw new InternalServerErrorException('Error creating date configuration');
    }
  }

  // Función para serializar fechas a strings YYYY-MM-DD
  private serializeFechas(fechas: FechasConfig[]): any[] {
    return fechas.map(fecha => ({
      ...fecha,
      fecha: fecha.fecha ? fecha.fecha.toISOString().split('T')[0] : null
    }));
  }

  async findAll(): Promise<FechasConfig[]> {
    try {
      console.log('🔍 FechasConfigService.findAll() - Iniciando consulta...');
      const result = await this.fechasConfigRepository.find({
        order: { fecha: 'ASC' }
      });
      
      // Logging detallado de las fechas que se envían
      console.log('📅 Fechas encontradas:', result.length);
      result.forEach((fecha, index) => {
        console.log(`📅 Fecha ${index + 1}:`, {
          id: fecha.id,
          fecha: fecha.fecha,
          fechaType: typeof fecha.fecha,
          fechaISO: fecha.fecha?.toISOString(),
          fechaLocal: fecha.fecha?.toLocaleDateString('es-ES'),
          activo: fecha.activo,
          tipoReserva: fecha.tipoReserva,
          turnos: fecha.turnos
        });
      });
      
      console.log('✅ FechasConfigService.findAll() - Resultado:', result?.length || 0, 'registros');
      
      // Serializar fechas antes de enviar al frontend
      const fechasSerializadas = this.serializeFechas(result);
      console.log('📤 Fechas serializadas para frontend:', fechasSerializadas.length);
      
      return fechasSerializadas;
    } catch (error) {
      console.error('❌ Error in FechasConfigService.findAll():', error);
      console.error('❌ Error stack:', error.stack);
      throw new InternalServerErrorException('Error retrieving date configurations');
    }
  }

  async findOne(id: number): Promise<FechasConfig> {
    try {
      const fechasConfig = await this.fechasConfigRepository.findOne({ where: { id } });
      if (!fechasConfig) {
        throw new NotFoundException(`FechasConfig with ID ${id} not found`);
      }
      return fechasConfig;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('❌ Error in FechasConfigService.findOne():', error);
      throw new InternalServerErrorException('Error retrieving date configuration');
    }
  }

  async update(id: number, updateFechasConfigDto: Partial<CreateFechasConfigDto>): Promise<FechasConfig> {
    try {
      const fechasConfig = await this.findOne(id);
      Object.assign(fechasConfig, updateFechasConfigDto);
      return await this.fechasConfigRepository.save(fechasConfig);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('❌ Error in FechasConfigService.update():', error);
      throw new InternalServerErrorException('Error updating date configuration');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const fechasConfig = await this.findOne(id);
      await this.fechasConfigRepository.remove(fechasConfig);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('❌ Error in FechasConfigService.remove():', error);
      throw new InternalServerErrorException('Error removing date configuration');
    }
  }

  async findByTipoReserva(tipoReserva: string): Promise<FechasConfig[]> {
    try {
      console.log(`🔍 FechasConfigService.findByTipoReserva('${tipoReserva}') - Iniciando consulta...`);
      const result = await this.fechasConfigRepository.find({
        where: { 
          activo: true,
          tipoReserva: tipoReserva 
        },
        order: { fecha: 'ASC' }
      });
      
      // Logging detallado de las fechas que se envían
      console.log(`📅 Fechas encontradas para ${tipoReserva}:`, result.length);
      result.forEach((fecha, index) => {
        console.log(`📅 Fecha ${tipoReserva} ${index + 1}:`, {
          id: fecha.id,
          fecha: fecha.fecha,
          fechaType: typeof fecha.fecha,
          fechaISO: fecha.fecha?.toISOString(),
          fechaLocal: fecha.fecha?.toLocaleDateString('es-ES'),
          activo: fecha.activo,
          tipoReserva: fecha.tipoReserva,
          turnos: fecha.turnos
        });
      });
      
      console.log(`✅ FechasConfigService.findByTipoReserva('${tipoReserva}') - Resultado:`, result?.length || 0, 'registros');
      
      // Serializar fechas antes de enviar al frontend
      const fechasSerializadas = this.serializeFechas(result);
      console.log(`📤 Fechas serializadas para frontend (${tipoReserva}):`, fechasSerializadas.length);
      
      return fechasSerializadas;
    } catch (error) {
      console.error('❌ Error in FechasConfigService.findByTipoReserva():', error);
      throw new InternalServerErrorException('Error retrieving date configurations by type');
    }
  }
} 
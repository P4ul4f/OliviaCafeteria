import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FechasConfig } from './fechas-config.entity';

@Injectable()
export class FechasConfigService {
  constructor(
    @InjectRepository(FechasConfig)
    private readonly fechasConfigRepo: Repository<FechasConfig>,
  ) {}

  async findAll(): Promise<FechasConfig[]> {
    return this.fechasConfigRepo.find({ order: { fecha: 'ASC' } });
  }

  async findOne(id: number): Promise<FechasConfig> {
    const fecha = await this.fechasConfigRepo.findOne({ where: { id } });
    if (!fecha) throw new NotFoundException('Fecha no encontrada');
    return fecha;
  }

  async create(data: Partial<FechasConfig>): Promise<FechasConfig> {
    console.log('🔍 FechasConfigService.create - Datos recibidos:', data);
    
    try {
      // Normalizar la fecha para evitar problemas de zona horaria
      if (data.fecha) {
        let fechaNormalizada: Date;
        
        if (typeof data.fecha === 'string') {
          // Si es un string, parsearlo correctamente
          const [year, month, day] = data.fecha.split('-').map(Number);
          fechaNormalizada = new Date(year, month - 1, day, 12, 0, 0, 0);
        } else {
          // Si ya es un Date, crear uno nuevo para evitar mutaciones
          fechaNormalizada = new Date(data.fecha);
          fechaNormalizada.setHours(12, 0, 0, 0);
        }
        
        data.fecha = fechaNormalizada;
        
        console.log('📅 Fecha normalizada:', {
          original: data.fecha,
          normalizada: fechaNormalizada,
          fechaISO: fechaNormalizada.toISOString(),
          fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
          fechaString: `${fechaNormalizada.getFullYear()}-${String(fechaNormalizada.getMonth() + 1).padStart(2, '0')}-${String(fechaNormalizada.getDate()).padStart(2, '0')}`
        });
      }
      
      const nueva = this.fechasConfigRepo.create(data);
      console.log('✅ FechasConfigService.create - Entidad creada:', nueva);
      
      const resultado = await this.fechasConfigRepo.save(nueva);
      console.log('✅ FechasConfigService.create - Guardado exitoso:', resultado);
      
      return resultado;
    } catch (error) {
      console.error('❌ FechasConfigService.create - Error:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<FechasConfig>): Promise<FechasConfig> {
    const fecha = await this.findOne(id);
    
    // Normalizar la fecha si se está actualizando
    if (data.fecha) {
      let fechaNormalizada: Date;
      
      if (typeof data.fecha === 'string') {
        // Si es un string, parsearlo correctamente
        const [year, month, day] = data.fecha.split('-').map(Number);
        fechaNormalizada = new Date(year, month - 1, day, 12, 0, 0, 0);
      } else {
        // Si ya es un Date, crear uno nuevo para evitar mutaciones
        fechaNormalizada = new Date(data.fecha);
        fechaNormalizada.setHours(12, 0, 0, 0);
      }
      
      data.fecha = fechaNormalizada;
      
      console.log('📅 Fecha actualizada normalizada:', {
        original: data.fecha,
        normalizada: fechaNormalizada,
        fechaISO: fechaNormalizada.toISOString(),
        fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
        fechaString: `${fechaNormalizada.getFullYear()}-${String(fechaNormalizada.getMonth() + 1).padStart(2, '0')}-${String(fechaNormalizada.getDate()).padStart(2, '0')}`
      });
    }
    
    Object.assign(fecha, data);
    return this.fechasConfigRepo.save(fecha);
  }

  async remove(id: number): Promise<void> {
    await this.fechasConfigRepo.delete(id);
  }
} 
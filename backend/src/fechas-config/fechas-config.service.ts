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
          const fechaString = data.fecha as string;
          const [year, month, day] = fechaString.split('-').map(Number);
          
          // SOLUCIÓN ROBUSTA: Crear la fecha usando el constructor local
          // y asegurarnos de que se mantenga en la zona horaria local
          fechaNormalizada = new Date(year, month - 1, day);
          
          console.log('🔍 Debug fecha string:', {
            fechaString,
            year,
            month,
            day,
            fechaNormalizada: fechaNormalizada.toISOString(),
            fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
            fechaDateString: fechaNormalizada.toDateString(),
            fechaTime: fechaNormalizada.getTime()
          });
        } else {
          // Si ya es un Date, crear uno nuevo para evitar mutaciones
          const originalDate = data.fecha;
          fechaNormalizada = new Date(
            originalDate.getFullYear(),
            originalDate.getMonth(),
            originalDate.getDate()
          );
        }
        
        data.fecha = fechaNormalizada;
        
        console.log('📅 Fecha normalizada:', {
          original: data.fecha,
          normalizada: fechaNormalizada,
          fechaISO: fechaNormalizada.toISOString(),
          fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
          fechaDateString: fechaNormalizada.toDateString(),
          fechaTime: fechaNormalizada.getTime()
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
        const fechaString = data.fecha as string;
        const [year, month, day] = fechaString.split('-').map(Number);
        
        // SOLUCIÓN ROBUSTA: Crear la fecha usando el constructor local
        // y asegurarnos de que se mantenga en la zona horaria local
        fechaNormalizada = new Date(year, month - 1, day);
        
        console.log('🔍 Debug fecha update string:', {
          fechaString,
          year,
          month,
          day,
          fechaNormalizada: fechaNormalizada.toISOString(),
          fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
          fechaDateString: fechaNormalizada.toDateString(),
          fechaTime: fechaNormalizada.getTime()
        });
      } else {
        // Si ya es un Date, crear uno nuevo para evitar mutaciones
        const originalDate = data.fecha;
        fechaNormalizada = new Date(
          originalDate.getFullYear(),
          originalDate.getMonth(),
          originalDate.getDate()
        );
      }
      
      data.fecha = fechaNormalizada;
      
      console.log('📅 Fecha actualizada normalizada:', {
        original: data.fecha,
        normalizada: fechaNormalizada,
        fechaISO: fechaNormalizada.toISOString(),
        fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
        fechaDateString: fechaNormalizada.toDateString(),
        fechaTime: fechaNormalizada.getTime()
      });
    }
    
    Object.assign(fecha, data);
    return this.fechasConfigRepo.save(fecha);
  }

  async remove(id: number): Promise<void> {
    await this.fechasConfigRepo.delete(id);
  }
} 
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
      // SOLUCIÓN DEFINITIVA: Usar constructor de Date con mediodía para evitar zona horaria
      if (data.fecha && typeof data.fecha === 'string') {
        const fechaString = data.fecha as string;
        
        // Validar que el formato sea correcto (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
          throw new Error(`Formato de fecha inválido: ${fechaString}. Debe ser YYYY-MM-DD`);
        }
        
        const [year, month, day] = fechaString.split('-').map(Number);
        
        // SOLUCIÓN: Constructor con mediodía (12:00:00) para evitar problemas de zona horaria
        // Al estar en el medio del día, no hay riesgo de desplazamiento por zona horaria
        const fechaNormalizada = new Date(year, month - 1, day, 12, 0, 0, 0);
        
        console.log('🔍 Debug fecha string convertida a Date (SOLUCIÓN DEFINITIVA):', {
          fechaString,
          year,
          month,
          day,
          fechaNormalizada: fechaNormalizada.toISOString(),
          fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
          fechaDateString: fechaNormalizada.toDateString(),
          fechaTime: fechaNormalizada.getTime(),
          getDate: fechaNormalizada.getDate(),
          getUTCDate: fechaNormalizada.getUTCDate()
        });
        
        data.fecha = fechaNormalizada;
        
      } else if (data.fecha && data.fecha instanceof Date) {
        // Si ya es un Date, crear uno nuevo con solo los componentes de fecha
        const originalDate = data.fecha;
        const year = originalDate.getFullYear();
        const month = originalDate.getMonth();
        const day = originalDate.getDate();
        
        // SOLUCIÓN: Constructor con mediodía para evitar problemas de zona horaria
        const fechaNormalizada = new Date(year, month, day, 12, 0, 0, 0);
        
        console.log('🔍 Debug fecha Date normalizada (SOLUCIÓN DEFINITIVA):', {
          fechaOriginal: originalDate.toISOString(),
          year,
          month,
          day,
          fechaNormalizada: fechaNormalizada.toISOString(),
          fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
          getDate: fechaNormalizada.getDate(),
          getUTCDate: fechaNormalizada.getUTCDate()
        });
        
        data.fecha = fechaNormalizada;
      }
      
      console.log('📅 Fecha final que se enviará a la BD:', {
        fecha: data.fecha,
        tipo: typeof data.fecha,
        valor: data.fecha instanceof Date ? data.fecha.toISOString() : data.fecha
      });
      
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
    
    // SOLUCIÓN DEFINITIVA: Usar constructor de Date con mediodía para evitar zona horaria
    if (data.fecha && typeof data.fecha === 'string') {
      const fechaString = data.fecha as string;
      
      // Validar que el formato sea correcto (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
        throw new Error(`Formato de fecha inválido: ${fechaString}. Debe ser YYYY-MM-DD`);
      }
      
      const [year, month, day] = fechaString.split('-').map(Number);
      
      // SOLUCIÓN: Constructor con mediodía (12:00:00) para evitar problemas de zona horaria
      // Al estar en el medio del día, no hay riesgo de desplazamiento por zona horaria
      const fechaNormalizada = new Date(year, month - 1, day, 12, 0, 0, 0);
      
      console.log('🔍 Debug fecha update string convertida a Date (SOLUCIÓN DEFINITIVA):', {
        fechaString,
        year,
        month,
        day,
        fechaNormalizada: fechaNormalizada.toISOString(),
        fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
        fechaDateString: fechaNormalizada.toDateString(),
        fechaTime: fechaNormalizada.getTime(),
        getDate: fechaNormalizada.getDate(),
        getUTCDate: fechaNormalizada.getUTCDate()
      });
      
      data.fecha = fechaNormalizada;
      
    } else if (data.fecha && data.fecha instanceof Date) {
      // Si ya es un Date, crear uno nuevo con solo los componentes de fecha
      const originalDate = data.fecha;
      const year = originalDate.getFullYear();
      const month = originalDate.getMonth();
      const day = originalDate.getDate();
      
      // SOLUCIÓN: Constructor con mediodía para evitar problemas de zona horaria
      const fechaNormalizada = new Date(year, month, day, 12, 0, 0, 0);
      
      console.log('🔍 Debug fecha update Date normalizada (SOLUCIÓN DEFINITIVA):', {
        fechaOriginal: originalDate.toISOString(),
        year,
        month,
        day,
        fechaNormalizada: fechaNormalizada.toISOString(),
        fechaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
        getDate: fechaNormalizada.getDate(),
        getUTCDate: fechaNormalizada.getUTCDate()
      });
      
      data.fecha = fechaNormalizada;
    }
    
    console.log('📅 Fecha final que se enviará a la BD en update:', {
      fecha: data.fecha,
      tipo: typeof data.fecha,
      valor: data.fecha instanceof Date ? data.fecha.toISOString() : data.fecha
    });
    
    Object.assign(fecha, data);
    return this.fechasConfigRepo.save(fecha);
  }

  async remove(id: number): Promise<void> {
    await this.fechasConfigRepo.delete(id);
  }
} 
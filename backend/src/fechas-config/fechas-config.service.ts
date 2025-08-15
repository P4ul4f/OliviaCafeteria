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
      // SOLUCIÓN DEFINITIVA: Solo manejar strings de fecha
      if (data.fecha && typeof data.fecha === 'string') {
        const fechaString = data.fecha as string;
        
        // Validar que el formato sea correcto (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
          throw new Error(`Formato de fecha inválido: ${fechaString}. Debe ser YYYY-MM-DD`);
        }
        
        // La fecha ya es string, no necesita conversión
        console.log('🔍 Debug fecha string (formato válido):', {
          fechaString,
          tipo: typeof data.fecha,
          longitud: fechaString.length,
          formato: fechaString
        });
        
        // No cambiar nada - data.fecha ya es el string correcto
        
      } else if (data.fecha && data.fecha instanceof Date) {
        // Si por alguna razón llega un Date, convertirlo a string YYYY-MM-DD
        const year = data.fecha.getFullYear();
        const month = String(data.fecha.getMonth() + 1).padStart(2, '0');
        const day = String(data.fecha.getDate()).padStart(2, '0');
        const fechaString = `${year}-${month}-${day}`;
        
        console.log('🔍 Debug fecha Date convertida a string:', {
          fechaOriginal: data.fecha.toISOString(),
          fechaConvertida: fechaString,
          tipo: typeof fechaString
        });
        
        data.fecha = fechaString;
      } else if (!data.fecha) {
        throw new Error('La fecha es requerida');
      }
      
      console.log('📅 Fecha final que se enviará a la BD:', {
        fecha: data.fecha,
        tipo: typeof data.fecha,
        valor: data.fecha
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
    
    // SOLUCIÓN DEFINITIVA: Solo manejar strings de fecha
    if (data.fecha && typeof data.fecha === 'string') {
      const fechaString = data.fecha as string;
      
      // Validar que el formato sea correcto (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
        throw new Error(`Formato de fecha inválido: ${fechaString}. Debe ser YYYY-MM-DD`);
      }
      
      // La fecha ya es string, no necesita conversión
      console.log('🔍 Debug fecha update string (formato válido):', {
        fechaString,
        tipo: typeof data.fecha,
        longitud: fechaString.length,
        formato: fechaString
      });
      
      // No cambiar nada - data.fecha ya es el string correcto
      
    } else if (data.fecha && data.fecha instanceof Date) {
      // Si por alguna razón llega un Date, convertirlo a string YYYY-MM-DD
      const year = data.fecha.getFullYear();
      const month = String(data.fecha.getMonth() + 1).padStart(2, '0');
      const day = String(data.fecha.getDate()).padStart(2, '0');
      const fechaString = `${year}-${month}-${day}`;
      
      console.log('🔍 Debug fecha update Date convertida a string:', {
        fechaOriginal: data.fecha.toISOString(),
        fechaConvertida: fechaString,
        tipo: typeof fechaString
      });
      
      data.fecha = fechaString;
    }
    
    console.log('📅 Fecha final que se enviará a la BD en update:', {
      fecha: data.fecha,
      tipo: typeof data.fecha,
      valor: data.fecha
    });
    
    Object.assign(fecha, data);
    return this.fechasConfigRepo.save(fecha);
  }

  async remove(id: number): Promise<void> {
    await this.fechasConfigRepo.delete(id);
  }
} 
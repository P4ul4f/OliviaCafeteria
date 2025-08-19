import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { FechasConfig } from './fechas-config.entity';
import { CreateFechasConfigDto } from './dto/create-fechas-config.dto';

@Injectable()
export class FechasConfigService {
  constructor(
    @InjectRepository(FechasConfig)
    private fechasConfigRepository: Repository<FechasConfig>,
  ) {}

  // Normaliza una fecha evitando problemas de timezone.
  // Acepta 'YYYY-MM-DD' o Date y la fija a las 12:00:00 LOCAL para evitar cambios de día.
  // SOLUCIÓN RAILWAY: Usar UTC de forma consistente para evitar diferencias de zona horaria
  private normalizeDateOnly(input: string | Date): Date {
    if (!input) return null as any;
    
    if (typeof input === 'string') {
      const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = Number(match[1]);
        const monthIndex = Number(match[2]) - 1;
        const day = Number(match[3]);
        
        // NUEVO: Crear fecha en UTC para evitar problemas de zona horaria
        // Esto asegura que el día se mantenga consistente independientemente del servidor
        const d = new Date(Date.UTC(year, monthIndex, day, 12, 0, 0, 0));
        console.log(`🌍 Fecha normalizada (UTC): ${input} -> ${d.toISOString()} (día UTC: ${d.getUTCDate()})`);
        return d;
      }
      
      // Para otros formatos de string, extraer componentes y usar UTC
      const parsed = new Date(input);
      if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const monthIndex = parsed.getMonth();
        const day = parsed.getDate();
        const d = new Date(Date.UTC(year, monthIndex, day, 12, 0, 0, 0));
        console.log(`🌍 Fecha normalizada desde string (UTC): ${input} -> ${d.toISOString()}`);
        return d;
      }
    }
    
    // Para objetos Date, extraer componentes locales y crear en UTC
    if (input instanceof Date) {
      const year = input.getFullYear();
      const monthIndex = input.getMonth();
      const day = input.getDate();
      const d = new Date(Date.UTC(year, monthIndex, day, 12, 0, 0, 0));
      console.log(`🌍 Fecha normalizada desde Date (UTC): ${input.toISOString()} -> ${d.toISOString()}`);
      return d;
    }
    
    // Fallback
    const d = new Date();
    d.setUTCHours(12, 0, 0, 0);
    return d;
  }

  async create(createFechasConfigDto: CreateFechasConfigDto): Promise<FechasConfig> {
    try {
      console.log('🔍 === DEBUG TIMEZONE - CREATE FECHA ===');
      console.log('📥 Fecha recibida del frontend:', createFechasConfigDto.fecha);
      console.log('🌍 Servidor timezone info:', {
        currentDate: new Date(),
        utcDate: new Date().toISOString(),
        localDate: new Date().toLocaleDateString('es-ES'),
        timezoneOffset: new Date().getTimezoneOffset(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      const payload: DeepPartial<FechasConfig> = { ...createFechasConfigDto } as DeepPartial<FechasConfig>;
      if (createFechasConfigDto.fecha) {
        const fechaNormalizada = this.normalizeDateOnly(createFechasConfigDto.fecha as any);
        console.log('🔄 Fecha después de normalizar:', {
          original: createFechasConfigDto.fecha,
          normalizada: fechaNormalizada,
          normalizadaISO: fechaNormalizada.toISOString(),
          normalizadaLocal: fechaNormalizada.toLocaleDateString('es-ES'),
          normalizadaUTCDate: fechaNormalizada.getUTCDate(),
          normalizadaLocalDate: fechaNormalizada.getDate()
        });
        payload.fecha = fechaNormalizada;
      }
      const fechasConfig: FechasConfig = this.fechasConfigRepository.create(payload) as FechasConfig;
      const resultado = await this.fechasConfigRepository.save(fechasConfig as FechasConfig);
      
      console.log('💾 Fecha guardada en DB:', {
        fechaGuardada: resultado.fecha,
        fechaGuardadaISO: resultado.fecha?.toISOString(),
        fechaGuardadaLocal: resultado.fecha?.toLocaleDateString('es-ES')
      });
      console.log('🔍 === FIN DEBUG TIMEZONE ===');
      
      return resultado;
    } catch (error) {
      console.error('❌ Error creating FechasConfig:', error);
      throw new InternalServerErrorException('Error creating date configuration');
    }
  }

  // Función para serializar fechas a strings YYYY-MM-DD
  // SOLUCIÓN RAILWAY: Usar métodos UTC para mantener consistencia
  private serializeFechas(fechas: FechasConfig[]): any[] {
    return fechas.map(fecha => {
      let fechaSerializada = null;
      if (fecha.fecha) {
        // Usar getUTCFullYear, getUTCMonth, getUTCDate para mantener el día correcto
        const year = fecha.fecha.getUTCFullYear();
        const month = String(fecha.fecha.getUTCMonth() + 1).padStart(2, '0');
        const day = String(fecha.fecha.getUTCDate()).padStart(2, '0');
        fechaSerializada = `${year}-${month}-${day}`;
        console.log(`📤 Serializando fecha: ${fecha.fecha.toISOString()} -> ${fechaSerializada} (día UTC: ${fecha.fecha.getUTCDate()})`);
      }
      
      return {
        ...fecha,
        fecha: fechaSerializada
      };
    });
  }

  async findAll(): Promise<FechasConfig[]> {
    try {
      console.log('🔍 FechasConfigService.findAll() - Iniciando consulta...');
      const result = await this.fechasConfigRepository.find({
        order: { fecha: 'ASC' }
      });
      
      // Logging detallado de las fechas que se envían
      console.log('📅 Fechas encontradas:', result.length);
      console.log('🌍 Servidor timezone info (findAll):', {
        currentDate: new Date(),
        utcDate: new Date().toISOString(),
        localDate: new Date().toLocaleDateString('es-ES'),
        timezoneOffset: new Date().getTimezoneOffset(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      result.forEach((fecha, index) => {
        console.log(`📅 Fecha ${index + 1}:`, {
          id: fecha.id,
          fecha: fecha.fecha,
          fechaType: typeof fecha.fecha,
          fechaISO: fecha.fecha?.toISOString(),
          fechaLocal: fecha.fecha?.toLocaleDateString('es-ES'),
          fechaUTCDate: fecha.fecha?.getUTCDate(),
          fechaLocalDate: fecha.fecha?.getDate(),
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
      const payload: DeepPartial<FechasConfig> = { ...updateFechasConfigDto } as DeepPartial<FechasConfig>;
      if (updateFechasConfigDto.fecha) {
        payload.fecha = this.normalizeDateOnly(updateFechasConfigDto.fecha as any);
      }
      Object.assign(fechasConfig, payload);
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
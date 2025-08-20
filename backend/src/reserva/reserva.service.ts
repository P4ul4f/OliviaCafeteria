import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Reserva, TipoReserva, EstadoReserva, EstadoPago } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateReservaConPagoDto } from './dto/create-reserva.dto';
import { PreciosConfigService } from '../precios-config/precios-config.service';
import { FechasConfig } from '../fechas-config/fechas-config.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(FechasConfig)
    private fechasConfigRepository: Repository<FechasConfig>,
    private preciosConfigService: PreciosConfigService,
  ) {}

  /**
   * Normaliza una fecha para evitar problemas de timezone
   * Acepta 'YYYY-MM-DD' o Date y la fija a las 12:00:00 LOCAL para evitar cambios de día.
   */
  private normalizeDateOnly(input: string | Date): Date {
    if (!input) return null as any;
    
    if (typeof input === 'string') {
      const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = Number(match[1]);
        const monthIndex = Number(match[2]) - 1;
        const day = Number(match[3]);
        
        // Crear fecha local a mediodía
        const d = new Date(year, monthIndex, day, 12, 0, 0, 0);
        console.log(`📅 Fecha normalizada en ReservaService: ${input} -> ${d.toISOString()} (día local: ${d.getDate()})`);
        return d;
      }
      
      // Para otros formatos de string
      const parsed = new Date(input);
      if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const monthIndex = parsed.getMonth();
        const day = parsed.getDate();
        const d = new Date(year, monthIndex, day, 12, 0, 0, 0);
        return d;
      }
    }
    
    // Para objetos Date
    if (input instanceof Date) {
      const year = input.getFullYear();
      const monthIndex = input.getMonth();
      const day = input.getDate();
      const d = new Date(year, monthIndex, day, 12, 0, 0, 0);
      return d;
    }
    
    // Fallback
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }

  /**
   * Obtiene el rango de fechas para consultas del día completo
   * considerando la zona horaria correcta
   */
  private getFechaRangoDelDia(fecha: Date): { fechaInicio: Date; fechaFin: Date } {
    // Normalizar la fecha base
    const fechaNormalizada = this.normalizeDateOnly(fecha);
    
    // Crear inicio del día (00:00:00 local)
    const fechaInicio = new Date(fechaNormalizada);
    fechaInicio.setHours(0, 0, 0, 0);
    
    // Crear fin del día (23:59:59 local)
    const fechaFin = new Date(fechaNormalizada);
    fechaFin.setHours(23, 59, 59, 999);
    
    console.log(`🗓️ Rango de fechas para consulta:`, {
      fechaOriginal: fecha.toISOString(),
      fechaNormalizada: fechaNormalizada.toISOString(),
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      rangoLocal: `${fechaInicio.toLocaleDateString('es-ES')} - ${fechaFin.toLocaleDateString('es-ES')}`
    });
    
    return { fechaInicio, fechaFin };
  }

  // Precios por persona
  private readonly PRECIOS = {
    [TipoReserva.A_LA_CARTA]: 0, // No hay precio fijo, se paga a la carta
    [TipoReserva.MERIENDA_LIBRE]: 17500,
    [TipoReserva.TARDE_TE]: 18500,
  };

  // Capacidad máxima por turno para tardes de té (5 personas por turno de 30 minutos)
  private readonly CAPACIDAD_MAXIMA_TURNO_TARDE_TE = 5;

  async create(dto: CreateReservaDto): Promise<Reserva> {
    // Verificar disponibilidad antes de crear
    const isAvailable = await this.checkAvailability({
      fecha: dto.fechaHora,
      turno: dto.turno,
      tipoReserva: dto.tipoReserva,
      cantidadPersonas: dto.cantidadPersonas,
    });

    if (!isAvailable.disponible) {
      throw new BadRequestException(isAvailable.mensaje || 'No hay disponibilidad para la fecha y horario seleccionados');
    }

    // Calcular monto total si no se proporciona
    if (!dto.montoTotal) {
      dto.montoTotal = await this.calcularPrecio(dto.tipoReserva, dto.cantidadPersonas);
    }

    const reserva = this.reservaRepository.create({
      nombreCliente: dto.nombreCliente,
      telefono: dto.telefono,
      fechaHora: dto.fechaHora,
      turno: dto.turno,
      cantidadPersonas: dto.cantidadPersonas,
      tipoReserva: dto.tipoReserva,
      montoTotal: dto.montoTotal,
      montoSenia: 0,
      estado: EstadoReserva.PENDIENTE,
      estadoPago: EstadoPago.PENDIENTE,
    });

    return this.reservaRepository.save(reserva);
  }

  async createConPago(dto: CreateReservaConPagoDto): Promise<Reserva> {
    // Verificar disponibilidad antes de crear
    const isAvailable = await this.checkAvailability({
      fecha: dto.fechaHora,
      turno: dto.turno,
      tipoReserva: dto.tipoReserva,
      cantidadPersonas: dto.cantidadPersonas,
    });

    if (!isAvailable.disponible) {
      throw new BadRequestException(isAvailable.mensaje || 'No hay disponibilidad para la fecha y horario seleccionados');
    }

    // Calcular monto total si no se proporciona
    if (!dto.montoTotal) {
      dto.montoTotal = await this.calcularPrecio(dto.tipoReserva, dto.cantidadPersonas);
    }

    // Crear la reserva directamente como confirmada y pagada
    const reserva = this.reservaRepository.create({
      nombreCliente: dto.nombreCliente,
      telefono: dto.telefono,
      fechaHora: dto.fechaHora,
      turno: dto.turno,
      cantidadPersonas: dto.cantidadPersonas,
      tipoReserva: dto.tipoReserva,
      montoTotal: dto.montoTotal,
      montoSenia: dto.montoSenia || 0,
      estado: EstadoReserva.CONFIRMADA,
      estadoPago: EstadoPago.PAGADO,
      idPagoExterno: dto.idPagoExterno,
      metodoPago: dto.metodoPago,
    });

    return this.reservaRepository.save(reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reserva | null> {
    // Validar que el ID sea un número válido
    if (id === null || id === undefined || isNaN(id)) {
      console.error('❌ ID inválido en findOne:', { id, tipo: typeof id });
      throw new BadRequestException('ID de reserva inválido');
    }
    
    return this.reservaRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateReservaDto): Promise<Reserva | null> {
    const reserva = await this.findOne(id);
    if (reserva) {
      // Forzar el valor de estado si llega como string (mayúsculas)
      if (dto.estado && typeof dto.estado === 'string') {
        dto.estado = dto.estado.toUpperCase() as any;
      }
      Object.assign(reserva, dto);
      const saved = await this.reservaRepository.save(reserva);
      return saved;
    }
    return null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.reservaRepository.delete(id);
    return (result.affected || 0) > 0;
  }

  async checkAvailability(dto: CheckAvailabilityDto): Promise<{
    disponible: boolean;
    capacidadDisponible: number;
    reservasExistentes: number;
    mensaje?: string;
  }> {
    const { fecha, turno, tipoReserva, cantidadPersonas } = dto;

    // Obtener el rango de fechas del día considerando timezone
    const { fechaInicio, fechaFin } = this.getFechaRangoDelDia(fecha);

    // Bloquear A LA CARTA y TARDES DE TÉ en días de Meriendas Libres
    if (tipoReserva === TipoReserva.A_LA_CARTA || tipoReserva === TipoReserva.TARDE_TE) {
      const esMeriendaLibre = await this.esDiaMeriendaLibre(fechaInicio);
      if (esMeriendaLibre) {
        return {
          disponible: false,
          capacidadDisponible: 0,
          reservasExistentes: 0,
          mensaje: 'No se permiten reservas de A la Carta ni Tardes de Té en días de Meriendas Libres',
        };
      }
    }

    // Buscar reservas existentes para esa fecha, turno y tipo de reserva
    const reservasExistentes = await this.reservaRepository.find({
      where: {
        fechaHora: Between(fechaInicio, fechaFin),
        turno,
        tipoReserva,
        estado: EstadoReserva.CONFIRMADA, // Solo contar reservas confirmadas
      },
    });

    if (tipoReserva === TipoReserva.TARDE_TE) {
      // Para tardes de té: máximo 5 reservas por turno (sin importar cantidad de personas)
      const reservasExistentesTurno = reservasExistentes.length;
      const capacidadDisponible = this.CAPACIDAD_MAXIMA_TURNO_TARDE_TE - reservasExistentesTurno;
      
      if (capacidadDisponible <= 0) {
        return {
          disponible: false,
          capacidadDisponible: 0,
          reservasExistentes: reservasExistentesTurno,
          mensaje: 'Este turno ya no tiene cupos disponibles',
        };
      }

      return {
        disponible: true,
        capacidadDisponible: capacidadDisponible,
        reservasExistentes: reservasExistentesTurno,
        mensaje: 'Disponible',
      };
    } else if (tipoReserva === TipoReserva.MERIENDA_LIBRE) {
      // Para meriendas libres: máximo 40 personas por turno
      const capacidadOcupada = reservasExistentes.reduce(
        (total, reserva) => total + reserva.cantidadPersonas,
        0
      );

      const cuposMaximos = await this.preciosConfigService.getCuposMeriendasLibres();
      const capacidadDisponible = cuposMaximos - capacidadOcupada;
      
      if (capacidadDisponible < cantidadPersonas) {
        return {
          disponible: false,
          capacidadDisponible: capacidadDisponible,
          reservasExistentes: reservasExistentes.length,
          mensaje: `Solo quedan ${capacidadDisponible} cupos disponibles para este turno`,
        };
      }

      return {
        disponible: true,
        capacidadDisponible: capacidadDisponible,
        reservasExistentes: reservasExistentes.length,
        mensaje: 'Disponible',
      };
    } else {
      // Para a la carta: sin límite específico
      return {
        disponible: true,
        capacidadDisponible: 999,
        reservasExistentes: reservasExistentes.length,
        mensaje: 'Disponible',
      };
    }
  }

  async getFechasDisponibles(tipoReserva: TipoReserva): Promise<Date[]> {
    try {
      // Para meriendas libres, obtener fechas de la base de datos
      if (tipoReserva === TipoReserva.MERIENDA_LIBRE) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const fechaLimite = new Date(hoy.getTime() + 90 * 24 * 60 * 60 * 1000);
        fechaLimite.setHours(23, 59, 59, 999);
        
        console.log(`🔍 Buscando fechas meriendas libres entre ${hoy.toISOString()} y ${fechaLimite.toISOString()}`);
        
        // Obtener fechas activas de la base de datos
        const fechasConfig = await this.fechasConfigRepository.find({
          where: {
            activo: true,
            fecha: Between(hoy, fechaLimite)
          },
          order: {
            fecha: 'ASC'
          }
        });
        
        console.log(`📅 Fechas encontradas en DB: ${fechasConfig.length}`);
        fechasConfig.forEach((fc, i) => {
          console.log(`  ${i+1}. ${fc.fecha.toISOString()} (día: ${fc.fecha.getDate()})`);
        });
        
        // Filtrar solo fechas futuras (comparar solo el día, no la hora)
        const hoyNormalizado = this.normalizeDateOnly(new Date());
        const fechasDisponibles = fechasConfig
          .map(fechaConfig => fechaConfig.fecha)
          .filter(fecha => {
            const fechaNormalizada = this.normalizeDateOnly(fecha);
            return fechaNormalizada >= hoyNormalizado;
          })
          .sort((a, b) => a.getTime() - b.getTime());
        
        console.log(`✅ Fechas disponibles después de filtrar: ${fechasDisponibles.length}`);
        return fechasDisponibles;
      }

      // Para a la carta y tardes de té, generar fechas disponibles (excluyendo domingos, fechas pasadas Y días de meriendas libres)
      const fechasDisponibles: Date[] = [];
      const hoy = this.normalizeDateOnly(new Date());
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() + 3); // 3 meses hacia adelante

      // Obtener días de meriendas libres para excluirlos
      const diasMeriendasLibres = await this.fechasConfigRepository.find({
        where: {
          activo: true,
          fecha: Between(hoy, fechaLimite)
        }
      });
      
      console.log('🔍 Días de meriendas libres encontrados:', diasMeriendasLibres.length);
      
      // Crear un Set con las fechas de meriendas libres para búsqueda rápida
      const fechasMeriendasLibres = new Set(
        diasMeriendasLibres.map(fechaConfig => {
          const fechaNormalizada = this.normalizeDateOnly(fechaConfig.fecha);
          return fechaNormalizada.getTime(); // Usar timestamp para comparación más confiable
        })
      );
      
      console.log('📅 Fechas de meriendas libres a excluir:', Array.from(fechasMeriendasLibres).map(timestamp => new Date(timestamp).toISOString().split('T')[0]));

      for (let fecha = new Date(hoy); fecha <= fechaLimite; fecha.setDate(fecha.getDate() + 1)) {
        // Normalizar la fecha de iteración
        const fechaIteracion = this.normalizeDateOnly(fecha);
        
        // Excluir domingos
        if (fechaIteracion.getDay() !== 0) {
          // Excluir días de meriendas libres
          const fechaTimestamp = fechaIteracion.getTime();
          
          console.log(`🔍 Verificando fecha: ${fechaIteracion.toISOString().split('T')[0]} - ¿Es de meriendas libres? ${fechasMeriendasLibres.has(fechaTimestamp)}`);
          
          if (!fechasMeriendasLibres.has(fechaTimestamp)) {
            // Para a la carta, no hay restricción de anticipación
            if (tipoReserva === TipoReserva.A_LA_CARTA) {
              fechasDisponibles.push(new Date(fechaIteracion));
            } else {
              // Para tardes de té, verificar que haya al menos 48 horas de anticipación
              const fechaMinima = new Date();
              fechaMinima.setDate(fechaMinima.getDate() + 2);
              const fechaMinimaNormalizada = this.normalizeDateOnly(fechaMinima);
              
              if (fechaIteracion >= fechaMinimaNormalizada) {
                fechasDisponibles.push(new Date(fechaIteracion));
              }
            }
          } else {
            console.log(`❌ Fecha ${fechaIteracion.toISOString().split('T')[0]} excluida por ser día de meriendas libres`);
          }
        }
      }

      console.log(`✅ Fechas disponibles para ${tipoReserva}:`, fechasDisponibles.length);
      return fechasDisponibles;
    } catch (error) {
      console.error('❌ Error en getFechasDisponibles:', error);
      // En caso de error, devolver fechas hardcodeadas como fallback
      return [
        new Date(2025, 7, 8), // 8 de Agosto
        new Date(2025, 7, 9), // 9 de Agosto
        new Date(2025, 7, 15), // 15 de Agosto
        new Date(2025, 7, 16), // 16 de Agosto
        new Date(2025, 7, 29), // 29 de Agosto
        new Date(2025, 7, 30), // 30 de Agosto
      ];
    }
  }

  async getFechasDisponiblesConCupos(tipoReserva: TipoReserva): Promise<{ fecha: Date; disponible: boolean; cuposDisponibles: number }[]> {
    const fechasBase = await this.getFechasDisponibles(tipoReserva);
    const fechasConCupos: { fecha: Date; disponible: boolean; cuposDisponibles: number }[] = [];

    for (const fecha of fechasBase) {
      const { fechaInicio, fechaFin } = this.getFechaRangoDelDia(fecha);

      // Obtener horarios disponibles para esta fecha
      const horarios = await this.getHorariosDisponibles(fecha, tipoReserva);
      
      let fechaDisponible = false;
      let cuposDisponibles = 0;

      if (tipoReserva === TipoReserva.TARDE_TE || tipoReserva === TipoReserva.A_LA_CARTA) {
        // Para tardes de té Y a la carta: COMPARTEN el mismo salón (65 personas máximo por día)
        for (const horario of horarios) {
          // Calcular capacidad compartida considerando ambos tipos de reserva
          const capacidadCompartida = await this.calcularCapacidadCompartida(fecha, horario);
          const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
          console.log(`🏢 Capacidad máxima obtenida del servicio: ${capacidadMaxima}`);
          
          const cuposDisponiblesHorario = Math.max(0, capacidadMaxima - capacidadCompartida);
          
          if (cuposDisponiblesHorario > 0) {
            fechaDisponible = true;
            cuposDisponibles += cuposDisponiblesHorario;
          }
        }
      } else if (tipoReserva === TipoReserva.MERIENDA_LIBRE) {
        // Para meriendas libres: verificar si hay cupos en al menos un turno (espacio independiente)
        const turnos = ['16:30-18:30', '19:00-21:00'];
        
        for (const turno of turnos) {
          const reservasExistentes = await this.reservaRepository.find({
            where: {
              fechaHora: Between(fechaInicio, fechaFin),
              turno,
              tipoReserva,
              estado: EstadoReserva.CONFIRMADA,
            },
          });

          const capacidadOcupada = reservasExistentes.reduce(
            (total, reserva) => total + reserva.cantidadPersonas,
            0
          );

          const cuposMaximos = await this.preciosConfigService.getCuposMeriendasLibres();
          const cuposDisponiblesTurno = cuposMaximos - capacidadOcupada;

          if (cuposDisponiblesTurno > 0) {
            fechaDisponible = true;
            cuposDisponibles += cuposDisponiblesTurno;
          }
        }
      }

      fechasConCupos.push({
        fecha: new Date(fecha),
        disponible: fechaDisponible,
        cuposDisponibles,
      });
    }

    return fechasConCupos;
  }

  async getHorariosDisponibles(fecha: Date, tipoReserva: TipoReserva): Promise<string[]> {
    // Bloquear A LA CARTA y TARDES DE TÉ en días de Meriendas Libres
    if (tipoReserva === TipoReserva.A_LA_CARTA || tipoReserva === TipoReserva.TARDE_TE) {
      const esMeriendaLibre = await this.esDiaMeriendaLibre(fecha);
      if (esMeriendaLibre) {
        return [];
      }
    }
    if (tipoReserva === TipoReserva.MERIENDA_LIBRE) {
      return ['16:30-18:30', '19:00-21:00'];
    }

    if (tipoReserva === TipoReserva.A_LA_CARTA) {
      return ['12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
    }

    // Para tardes de té, verificar que la fecha cumpla con la anticipación mínima
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 2); // 48 horas de anticipación
    
    // Si la fecha no cumple con la anticipación, retornar array vacío (sin error)
    if (fecha < fechaMinima) {
      return [];
    }
    
    // Para tardes de té, generar horarios disponibles
    const horarios: string[] = [];
    
    // Horarios de mañana: 9:00 - 13:00 (cada 30 minutos)
    for (let hora = 9; hora <= 12; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 12 && minuto === 30) break;
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        horarios.push(`${horaStr}:${minutoStr}`);
      }
    }
    
    // Horarios de tarde: 17:00 - 20:30 (cada 30 minutos)
    for (let hora = 17; hora <= 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 20 && minuto === 30) break;
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        horarios.push(`${horaStr}:${minutoStr}`);
      }
    }
    
    return horarios;
  }

  async getHorariosDisponiblesConCupos(fecha: Date, tipoReserva: TipoReserva): Promise<{ horario: string; disponible: boolean; cuposDisponibles: number }[]> {
    const horariosBase = await this.getHorariosDisponibles(fecha, tipoReserva);
    
    if (tipoReserva === TipoReserva.MERIENDA_LIBRE) {
      // Para meriendas libres: verificar cupos por turno (espacio independiente)
      const horariosConCupos: { horario: string; disponible: boolean; cuposDisponibles: number }[] = [];
      const { fechaInicio, fechaFin } = this.getFechaRangoDelDia(fecha);

      const turnos = ['16:30-18:30', '19:00-21:00'];
      
      for (const turno of turnos) {
        // Buscar reservas existentes para esa fecha y turno
        const reservasExistentes = await this.reservaRepository.find({
          where: {
            fechaHora: Between(fechaInicio, fechaFin),
            turno,
            tipoReserva,
            estado: EstadoReserva.CONFIRMADA,
          },
        });

        // Calcular capacidad ocupada para el turno
        const capacidadOcupada = reservasExistentes.reduce(
          (total, reserva) => total + reserva.cantidadPersonas,
          0
        );

        const cuposMaximos = await this.preciosConfigService.getCuposMeriendasLibres();
        const cuposDisponibles = cuposMaximos - capacidadOcupada;
        const disponible = cuposDisponibles > 0;

        horariosConCupos.push({
          horario: turno,
          disponible,
          cuposDisponibles,
        });
      }

      return horariosConCupos;
    } else if (tipoReserva === TipoReserva.A_LA_CARTA || tipoReserva === TipoReserva.TARDE_TE) {
      // Si es día de meriendas libres, no hay horarios
      if (horariosBase.length === 0) {
        return [];
      }
      // Para a la carta y tardes de té: COMPARTEN el mismo salón (65 personas máximo por día)
      const horariosConCupos: { horario: string; disponible: boolean; cuposDisponibles: number }[] = [];
      
      for (const horario of horariosBase) {
        // Calcular capacidad compartida para este horario específico (considerando ambos tipos)
        const capacidadCompartida = await this.calcularCapacidadCompartida(fecha, horario);
        const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
        console.log(`🏢 Capacidad máxima obtenida del servicio: ${capacidadMaxima}`);
        const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadCompartida);
        const disponible = cuposDisponibles > 0;

        horariosConCupos.push({
          horario,
          disponible,
          cuposDisponibles,
        });
      }

      return horariosConCupos;
    } else {
      // Para otros tipos: todos los horarios están disponibles
      return horariosBase.map(horario => ({
        horario,
        disponible: true,
        cuposDisponibles: 999, // Valor alto para indicar sin límite específico
      }));
    }
  }

  async getCuposDisponibles(fecha: Date, turno: string, tipoReserva: TipoReserva): Promise<{
    cuposDisponibles: number;
    capacidadMaxima: number;
    capacidadOcupada: number;
    reservasExistentes: number;
  }> {
    console.log(`🔍 === INICIO getCuposDisponibles para ${tipoReserva} ===`);
    console.log(`📅 Fecha recibida:`, {
      fecha: fecha.toISOString(),
      fechaLocal: fecha.toLocaleDateString('es-ES'),
      timestamp: fecha.getTime()
    });
    console.log(`🕒 Turno: ${turno}`);

    // Obtener el rango de fechas del día considerando timezone
    const { fechaInicio, fechaFin } = this.getFechaRangoDelDia(fecha);

    if (tipoReserva === TipoReserva.MERIENDA_LIBRE) {
      // Para meriendas libres: calcular cupos disponibles (espacio independiente)
      const reservasExistentes = await this.reservaRepository.find({
        where: {
          fechaHora: Between(fechaInicio, fechaFin),
          turno,
          tipoReserva,
          estado: EstadoReserva.CONFIRMADA,
        },
      });

      const capacidadOcupada = reservasExistentes.reduce(
        (total, reserva) => total + reserva.cantidadPersonas,
        0
      );

      const capacidadMaxima = await this.preciosConfigService.getCuposMeriendasLibres();
      const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadOcupada);

      return {
        cuposDisponibles,
        capacidadMaxima,
        capacidadOcupada,
        reservasExistentes: reservasExistentes.length,
      };
    } else if (tipoReserva === TipoReserva.A_LA_CARTA || tipoReserva === TipoReserva.TARDE_TE) {
      // Bloquear en días de meriendas libres
      const esMeriendaLibre = await this.esDiaMeriendaLibre(fechaInicio);
      if (esMeriendaLibre) {
        return {
          cuposDisponibles: 0,
          capacidadMaxima: 0,
          capacidadOcupada: 0,
          reservasExistentes: 0,
        };
      }
      
      // Para a la carta y tardes de té: SISTEMA DE CUPOS POR HORAS
      // Los cupos se renuevan cada hora, pero las reservas pueden hacerse cada 30 min
      console.log(`🔍 === INICIO getCuposDisponibles para ${tipoReserva} (SISTEMA POR HORAS) ===`);
      console.log(`📅 Fecha recibida:`, {
        fecha: fecha.toISOString(),
        fechaLocal: fecha.toLocaleDateString('es-ES'),
        timestamp: fecha.getTime()
      });
      console.log(`🕒 Turno: ${turno}`);
      
      // Extraer la hora del turno para determinar el bloque horario
      const bloqueHorario = this.obtenerBloqueHorario(turno);
      console.log(`⏰ Bloque horario calculado: ${bloqueHorario}`);
      
      // Obtener todas las reservas del día completo para el salón compartido
      const todasReservasDelDia = await this.reservaRepository.find({
        where: {
          fechaHora: Between(fechaInicio, fechaFin),
          tipoReserva: In([TipoReserva.A_LA_CARTA, TipoReserva.TARDE_TE]),
          estado: EstadoReserva.CONFIRMADA,
        },
      });

      console.log(`📊 Total reservas del día encontradas:`, todasReservasDelDia.length);
      
      // Agrupar reservas por bloque horario y calcular ocupación
      const reservasPorBloque = this.agruparReservasPorBloqueHorario(todasReservasDelDia);
      console.log(`📋 Reservas agrupadas por bloque:`, Object.keys(reservasPorBloque).map(bloque => ({
        bloque,
        reservas: reservasPorBloque[bloque].length,
        personas: reservasPorBloque[bloque].reduce((sum, r) => sum + r.cantidadPersonas, 0)
      })));
      
      // Calcular capacidad ocupada para el bloque horario específico
      const reservasDelBloque = reservasPorBloque[bloqueHorario] || [];
      const capacidadOcupada = reservasDelBloque.reduce(
        (total, reserva) => total + reserva.cantidadPersonas,
        0
      );
      
      const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
      console.log(`🏢 Capacidad máxima obtenida del servicio: ${capacidadMaxima}`);
      const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadOcupada);

      console.log(`🔍 Cupos para ${tipoReserva} en bloque ${bloqueHorario}:00:`, {
        bloqueHorario: `${bloqueHorario}:00`,
        capacidadMaxima,
        capacidadOcupada,
        cuposDisponibles,
        reservasEnBloque: reservasDelBloque.length,
        totalReservasDelDia: todasReservasDelDia.length,
        reservasDelBloque: reservasDelBloque.map(r => ({
          id: r.id,
          tipo: r.tipoReserva,
          personas: r.cantidadPersonas,
          turno: r.turno
        }))
      });
      
      console.log(`🔍 === FIN getCuposDisponibles para ${tipoReserva} (SISTEMA POR HORAS) ===`);

      return {
        cuposDisponibles,
        capacidadMaxima,
        capacidadOcupada,
        reservasExistentes: reservasDelBloque.length,
      };
    } else {
      // Para otros tipos de reserva que no están implementados
      return {
        cuposDisponibles: 0,
        capacidadMaxima: 0,
        capacidadOcupada: 0,
        reservasExistentes: 0,
      };
    }
  }

  // Método para calcular capacidad compartida POR BLOQUE HORARIO (renovación cada hora)
  private async calcularCapacidadCompartida(fecha: Date, turno: string): Promise<number> {
    // Extraer el bloque horario del turno solicitado
    const bloqueHorario = this.obtenerBloqueHorario(turno);
    console.log(`⏰ Calculando capacidad para bloque horario: ${bloqueHorario} (turno: ${turno})`);

    // BÚSQUEDA PRECISA: Buscar reservas solo del día exacto solicitado
    const { fechaInicio, fechaFin } = this.getFechaRangoDelDia(fecha);

    console.log(`🔍 Buscando reservas para fecha exacta:`, {
      desde: fechaInicio.toISOString(),
      hasta: fechaFin.toISOString(),
      fechaOriginal: fecha.toISOString()
    });

    const todasReservasDelDia = await this.reservaRepository.find({
      where: {
        fechaHora: Between(fechaInicio, fechaFin),
        tipoReserva: In([TipoReserva.A_LA_CARTA, TipoReserva.TARDE_TE]), // Ambos tipos comparten salón
        estado: EstadoReserva.CONFIRMADA,
      },
    });

    console.log(`📋 Reservas encontradas para la fecha:`, todasReservasDelDia.map(r => ({
      id: r.id,
      fechaHora: r.fechaHora.toISOString(),
      turno: r.turno,
      personas: r.cantidadPersonas,
      tipo: r.tipoReserva
    })));

    // Agrupar reservas por bloque horario
    const reservasPorBloque = this.agruparReservasPorBloqueHorario(todasReservasDelDia);
    
    // Obtener solo las reservas del bloque horario específico
    const reservasDelBloque = reservasPorBloque[bloqueHorario] || [];
    
    // Calcular capacidad ocupada SOLO para este bloque horario
    const capacidadOcupada = reservasDelBloque.reduce(
      (total, reserva) => total + reserva.cantidadPersonas,
      0
    );

    console.log(`🔍 calcularCapacidadCompartida para bloque ${bloqueHorario}:`, {
      fecha: fecha.toDateString(),
      turno,
      bloqueHorario,
      totalReservasDelDia: todasReservasDelDia.length,
      reservasEnEsteBloque: reservasDelBloque.length,
      capacidadOcupada,
      detallesBloque: reservasDelBloque.map(r => ({
        id: r.id,
        tipo: r.tipoReserva,
        turno: r.turno,
        personas: r.cantidadPersonas,
        bloqueCalculado: this.obtenerBloqueHorario(r.turno),
        fechaHora: r.fechaHora.toISOString()
      }))
    });

    return capacidadOcupada;
  }

  // Verificar si una fecha es día de Meriendas Libres
  private async esDiaMeriendaLibre(fecha: Date): Promise<boolean> {
    const { fechaInicio: inicio, fechaFin: fin } = this.getFechaRangoDelDia(fecha);

    const count = await this.fechasConfigRepository.count({
      where: {
        fecha: Between(inicio, fin),
        activo: true,
      },
    });
    return count > 0;
  }

  private async calcularPrecio(tipoReserva: TipoReserva, cantidadPersonas: number): Promise<number> {
    // Para a la carta, usar el precio configurado
    if (tipoReserva === TipoReserva.A_LA_CARTA) {
      const precioALaCarta = await this.preciosConfigService.getPrecioALaCarta();
      return precioALaCarta * cantidadPersonas;
    }
    return this.PRECIOS[tipoReserva] * cantidadPersonas;
  }

  async confirmarPago(id: number, idPagoExterno: string, metodoPago: string): Promise<Reserva> {
    const reserva = await this.findOne(id);
    if (!reserva) {
      throw new BadRequestException('Reserva no encontrada');
    }

    reserva.estadoPago = EstadoPago.PAGADO;
    reserva.estado = EstadoReserva.CONFIRMADA;
    reserva.idPagoExterno = idPagoExterno;
    reserva.metodoPago = metodoPago;

    return this.reservaRepository.save(reserva);
  }

  /**
   * Obtiene el bloque horario (hora en punto) para un turno dado
   * Ejemplos:
   * - "12:00-13:00" → "12"
   * - "12:30-13:30" → "12" (se agrupa con el bloque de las 12)
   * - "13:00-14:00" → "13"
   * - "13:30-14:30" → "13" (se agrupa con el bloque de las 13)
   */
  private obtenerBloqueHorario(turno: string): string {
    try {
      // Extraer la hora de inicio del turno (formato: "HH:mm-HH:mm")
      const match = turno.match(/^(\d{1,2}):(\d{2})/);
      if (!match) {
        console.warn(`⚠️ Formato de turno no reconocido: ${turno}, usando bloque 12`);
        return "12"; // Fallback por defecto
      }
      
      const horaInicio = parseInt(match[1], 10);
      const minutoInicio = parseInt(match[2], 10);
      
      // Si es :30, pertenece al bloque de la hora anterior para el sistema de renovación
      // Ejemplo: 12:30 pertenece al bloque "12" (que se renueva a las 13:00)
      // Ejemplo: 13:30 pertenece al bloque "13" (que se renueva a las 14:00)
      const bloqueHora = minutoInicio >= 30 ? horaInicio : horaInicio;
      
      console.log(`🕒 Turno "${turno}" → Bloque horario: ${bloqueHora}`);
      return bloqueHora.toString();
    } catch (error) {
      console.error(`❌ Error procesando turno ${turno}:`, error);
      return "12"; // Fallback seguro
    }
  }

  /**
   * Agrupa las reservas por bloque horario
   * Cada bloque representa una hora en punto donde se renuevan los cupos
   */
  private agruparReservasPorBloqueHorario(reservas: Reserva[]): { [bloque: string]: Reserva[] } {
    const agrupadas: { [bloque: string]: Reserva[] } = {};
    
    for (const reserva of reservas) {
      const bloqueHorario = this.obtenerBloqueHorario(reserva.turno);
      
      if (!agrupadas[bloqueHorario]) {
        agrupadas[bloqueHorario] = [];
      }
      
      agrupadas[bloqueHorario].push(reserva);
    }
    
    // Logging para debug
    Object.keys(agrupadas).forEach(bloque => {
      const personasEnBloque = agrupadas[bloque].reduce((sum, r) => sum + r.cantidadPersonas, 0);
      console.log(`📊 Bloque ${bloque}:00 - ${agrupadas[bloque].length} reservas, ${personasEnBloque} personas`);
    });
    
    return agrupadas;
  }
} 
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

    // Obtener la fecha de inicio y fin del día
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

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
        
        // Obtener fechas activas y futuras de la base de datos
        const fechasConfig = await this.fechasConfigRepository.find({
          where: {
            activo: true,
            fecha: Between(hoy, new Date(hoy.getTime() + 90 * 24 * 60 * 60 * 1000)) // 90 días hacia adelante
          },
          order: {
            fecha: 'ASC'
          }
        });
        
        // Convertir a objetos Date y filtrar solo fechas futuras
        const fechasDisponibles = fechasConfig
          .map(fechaConfig => new Date(fechaConfig.fecha))
          .filter(fecha => fecha >= hoy)
          .sort((a, b) => a.getTime() - b.getTime());
        
        return fechasDisponibles;
      }

      // Para a la carta y tardes de té, generar fechas disponibles (excluyendo domingos, fechas pasadas Y días de meriendas libres)
      const fechasDisponibles: Date[] = [];
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
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
      // Usar formato YYYY-MM-DD para comparación más confiable
      const fechasMeriendasLibres = new Set(
        diasMeriendasLibres.map(fechaConfig => {
          const fecha = new Date(fechaConfig.fecha);
          fecha.setHours(0, 0, 0, 0); // Normalizar a inicio del día
          return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        })
      );
      
      console.log('📅 Fechas de meriendas libres a excluir:', Array.from(fechasMeriendasLibres));

      for (let fecha = new Date(hoy); fecha <= fechaLimite; fecha.setDate(fecha.getDate() + 1)) {
        // Normalizar la fecha de iteración
        const fechaIteracion = new Date(fecha);
        fechaIteracion.setHours(0, 0, 0, 0);
        
        // Excluir domingos
        if (fechaIteracion.getDay() !== 0) {
          // Excluir días de meriendas libres usando formato YYYY-MM-DD
          const fechaString = fechaIteracion.toISOString().split('T')[0];
          
          console.log(`🔍 Verificando fecha: ${fechaString} - ¿Es de meriendas libres? ${fechasMeriendasLibres.has(fechaString)}`);
          
          if (!fechasMeriendasLibres.has(fechaString)) {
            // Para a la carta, no hay restricción de anticipación
            if (tipoReserva === TipoReserva.A_LA_CARTA) {
              fechasDisponibles.push(new Date(fechaIteracion));
            } else {
              // Para tardes de té, verificar que haya al menos 48 horas de anticipación
              const fechaMinima = new Date();
              fechaMinima.setDate(fechaMinima.getDate() + 2);
              fechaMinima.setHours(0, 0, 0, 0);
              
              if (fechaIteracion >= fechaMinima) {
                fechasDisponibles.push(new Date(fechaIteracion));
              }
            }
          } else {
            console.log(`❌ Fecha ${fechaString} excluida por ser día de meriendas libres`);
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
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

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
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

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
      // Para a la carta y tardes de té: COMPARTEN el mismo salón (65 personas máximo por día)
      const horariosConCupos: { horario: string; disponible: boolean; cuposDisponibles: number }[] = [];
      
      for (const horario of horariosBase) {
        // Calcular capacidad compartida para este horario específico (considerando ambos tipos)
        const capacidadCompartida = await this.calcularCapacidadCompartida(fecha, horario);
        const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
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
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

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
      // Para a la carta y tardes de té: COMPARTEN el mismo salón (65 personas máximo por día)
      const reservasCompartidas = await this.reservaRepository.find({
        where: {
          fechaHora: Between(fechaInicio, fechaFin),
          tipoReserva: In([TipoReserva.A_LA_CARTA, TipoReserva.TARDE_TE]),
          estado: EstadoReserva.CONFIRMADA,
        },
      });

      // Calcular capacidad ocupada sumando todas las reservas del día (sin ventanas de tiempo complejas)
      const capacidadOcupada = reservasCompartidas.reduce(
        (total, reserva) => total + reserva.cantidadPersonas,
        0
      );
      
      const capacidadMaxima = await this.preciosConfigService.getCapacidadMaximaCompartida();
      const cuposDisponibles = Math.max(0, capacidadMaxima - capacidadOcupada);

      console.log(`🔍 Cupos para ${tipoReserva} en ${fecha.toDateString()}:`, {
        capacidadMaxima,
        capacidadOcupada,
        cuposDisponibles,
        reservasExistentes: reservasCompartidas.length,
        reservas: reservasCompartidas.map(r => ({
          id: r.id,
          tipo: r.tipoReserva,
          personas: r.cantidadPersonas,
          hora: r.fechaHora.toTimeString()
        }))
      });

      return {
        cuposDisponibles,
        capacidadMaxima,
        capacidadOcupada,
        reservasExistentes: reservasCompartidas.length,
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

  // Método para calcular capacidad compartida considerando estadía variable
  private async calcularCapacidadCompartida(fecha: Date, turno: string): Promise<number> {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    // Buscar reservas de a la carta Y tardes de té para esa fecha (COMPARTEN el mismo salón)
    const reservasCompartidas = await this.reservaRepository.find({
      where: {
        fechaHora: Between(fechaInicio, fechaFin),
        tipoReserva: In([TipoReserva.A_LA_CARTA, TipoReserva.TARDE_TE]), // Ambos tipos comparten
        estado: EstadoReserva.CONFIRMADA,
      },
    });

    // Calcular capacidad ocupada considerando estadía variable para ambos tipos
    let capacidadOcupada = 0;
    const ventanasTiempo = new Map<string, number>();

    for (const reserva of reservasCompartidas) {
      const horaReserva = new Date(reserva.fechaHora);
      const horaInicio = horaReserva.getHours() + horaReserva.getMinutes() / 60;
      
      // Para ambos tipos: estadía de 1 hora (comparten el mismo espacio)
      const duracionEstadia = 1;
      
      // Calcular ventanas de tiempo afectadas
      for (let i = 0; i < duracionEstadia * 2; i++) { // Multiplicar por 2 porque hay ventanas cada 30 min
        const ventanaHora = horaInicio + (i * 0.5);
        const ventanaKey = `${Math.floor(ventanaHora)}:${(ventanaHora % 1) * 60}`;
        
        const capacidadActual = ventanasTiempo.get(ventanaKey) || 0;
        ventanasTiempo.set(ventanaKey, capacidadActual + reserva.cantidadPersonas);
      }
    }

    // Encontrar la ventana con mayor capacidad ocupada
    for (const capacidad of ventanasTiempo.values()) {
      capacidadOcupada = Math.max(capacidadOcupada, capacidad);
    }

    return capacidadOcupada;
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
} 
import { Repository } from 'typeorm';
import { Reserva, TipoReserva } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateReservaConPagoDto } from './dto/create-reserva.dto';
import { PreciosConfigService } from '../precios-config/precios-config.service';
import { FechasConfig } from '../fechas-config/fechas-config.entity';
export declare class ReservaService {
    private reservaRepository;
    private fechasConfigRepository;
    private preciosConfigService;
    constructor(reservaRepository: Repository<Reserva>, fechasConfigRepository: Repository<FechasConfig>, preciosConfigService: PreciosConfigService);
    private readonly PRECIOS;
    private readonly CAPACIDAD_MAXIMA_TURNO_TARDE_TE;
    create(dto: CreateReservaDto): Promise<Reserva>;
    createConPago(dto: CreateReservaConPagoDto): Promise<Reserva>;
    findAll(): Promise<Reserva[]>;
    findOne(id: number): Promise<Reserva | null>;
    update(id: number, dto: UpdateReservaDto): Promise<Reserva | null>;
    remove(id: number): Promise<boolean>;
    checkAvailability(dto: CheckAvailabilityDto): Promise<{
        disponible: boolean;
        capacidadDisponible: number;
        reservasExistentes: number;
        mensaje?: string;
    }>;
    getFechasDisponibles(tipoReserva: TipoReserva): Promise<Date[]>;
    getFechasDisponiblesConCupos(tipoReserva: TipoReserva): Promise<{
        fecha: Date;
        disponible: boolean;
        cuposDisponibles: number;
    }[]>;
    getHorariosDisponibles(fecha: Date, tipoReserva: TipoReserva): Promise<string[]>;
    getHorariosDisponiblesConCupos(fecha: Date, tipoReserva: TipoReserva): Promise<{
        horario: string;
        disponible: boolean;
        cuposDisponibles: number;
    }[]>;
    getCuposDisponibles(fecha: Date, turno: string, tipoReserva: TipoReserva): Promise<{
        cuposDisponibles: number;
        capacidadMaxima: number;
        capacidadOcupada: number;
        reservasExistentes: number;
    }>;
    private calcularCapacidadCompartida;
    private calcularPrecio;
    confirmarPago(id: number, idPagoExterno: string, metodoPago: string): Promise<Reserva>;
}

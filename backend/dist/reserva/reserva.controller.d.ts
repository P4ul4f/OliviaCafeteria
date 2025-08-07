import { ReservaService } from './reserva.service';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { TipoReserva } from './reserva.entity';
import { CreateReservaConPagoDto } from './dto/create-reserva.dto';
export declare class ReservaController {
    private readonly reservaService;
    constructor(reservaService: ReservaService);
    testDatabase(): {
        message: string;
        timestamp: string;
        status: string;
    };
    testHorarios(): {
        message: string;
        horarios: string[];
        timestamp: string;
    };
    getHorariosSimple(): {
        success: boolean;
        horarios: string[];
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        horarios?: undefined;
    };
    createConPago(dto: CreateReservaConPagoDto): Promise<import("./reserva.entity").Reserva>;
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
    getHorariosDisponibles(fecha: string, tipoReservaString: string): Promise<string[]>;
    getHorariosDisponiblesConCupos(fecha: string, tipoReservaString: string): Promise<{
        horario: string;
        disponible: boolean;
        cuposDisponibles: number;
    }[]>;
    confirmarPago(id: string, body: {
        idPagoExterno: string;
        metodoPago: string;
    }): Promise<import("./reserva.entity").Reserva>;
    findAll(): Promise<import("./reserva.entity").Reserva[]>;
    findOne(id: string): Promise<import("./reserva.entity").Reserva | null>;
    update(id: string, dto: UpdateReservaDto): Promise<import("./reserva.entity").Reserva | null>;
    remove(id: string): Promise<boolean>;
}

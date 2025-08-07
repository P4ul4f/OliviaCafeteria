import { Repository } from 'typeorm';
import { Pago } from './pago.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { ReservaService } from '../reserva/reserva.service';
import { GiftCardService } from '../giftcard/giftcard.service';
export declare class PagoService {
    private pagoRepository;
    private reservaService;
    private giftCardService;
    private readonly logger;
    private mercadopago;
    constructor(pagoRepository: Repository<Pago>, reservaService: ReservaService, giftCardService: GiftCardService);
    private initializeMercadoPago;
    crearPreferenciaMercadoPago(reservaData: any, monto: number, descripcion: string): Promise<{
        id: string | undefined;
        init_point: string | undefined;
        sandbox_init_point: string | undefined;
        external_reference: string;
    }>;
    procesarNotificacionPago(notificationData: any): Promise<{
        status: string;
        giftCardId: number;
        pagoId: number;
        message: string;
    } | {
        status: string;
        reservaId: number;
        pagoId: number;
        message: string;
    } | {
        status: string;
        message: string;
    }>;
    private procesarPagoAprobado;
    procesarPagoTarjeta(reservaData: any, monto: number, descripcion: string, datosLarjeta: any): Promise<{
        status: string;
        id: string;
        external_reference: string;
        reservaId: number;
        message: string;
        status_detail?: undefined;
    } | {
        status: string;
        id: number | undefined;
        external_reference: string;
        reservaId: number;
        message: string;
        status_detail?: undefined;
    } | {
        status: string;
        id: number | undefined;
        external_reference: string;
        message: string;
        reservaId?: undefined;
        status_detail?: undefined;
    } | {
        status: string | undefined;
        id: number | undefined;
        external_reference: string;
        message: string;
        status_detail: string | undefined;
        reservaId?: undefined;
    }>;
    private crearReservaConPago;
    crearPreferenciaGiftCard(giftCardData: any, monto: number, descripcion: string): Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse | {
        id: string;
        init_point: string;
        sandbox_init_point: string;
        external_reference: string;
    }>;
    procesarPagoTarjetaGiftCard(giftCardData: any, monto: number, descripcion: string, datosLarjeta: any): Promise<{
        status: string;
        payment_id: string;
        id: string;
        external_reference: string;
        giftcard_id: number;
        message: string;
    } | {
        status: string;
        payment_id: number | undefined;
        giftcard_id: number;
        message: string;
        id?: undefined;
        external_reference?: undefined;
    } | {
        status: string | undefined;
        payment_id: number | undefined;
        message: string;
        id?: undefined;
        external_reference?: undefined;
        giftcard_id?: undefined;
    }>;
    private procesarPagoAprobadoGiftCard;
    create(createPagoDto: CreatePagoDto): Promise<CreatePagoDto & Pago>;
    findAll(): Promise<Pago[]>;
    findOne(id: number): Promise<Pago | null>;
    update(id: number, updatePagoDto: UpdatePagoDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}

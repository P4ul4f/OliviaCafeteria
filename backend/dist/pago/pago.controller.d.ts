import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
export declare class PagoController {
    private readonly pagoService;
    private readonly logger;
    constructor(pagoService: PagoService);
    crearPreferencia(body: {
        reservaData: any;
        monto: number;
        descripcion: string;
    }): Promise<{
        id: string | undefined;
        init_point: string | undefined;
        sandbox_init_point: string | undefined;
        external_reference: string;
    }>;
    crearPreferenciaGiftCard(body: {
        giftCardData: any;
        monto: number;
        descripcion: string;
    }): Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse | {
        id: string;
        init_point: string;
        sandbox_init_point: string;
        external_reference: string;
    }>;
    pagarConTarjeta(body: {
        reservaData: any;
        total: number;
        descripcion: string;
        datosLarjeta: any;
    }): Promise<{
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
    pagarGiftCardConTarjeta(body: {
        giftCardData: any;
        total: number;
        descripcion: string;
        datosLarjeta: any;
    }): Promise<{
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
    procesarWebhook(notificationData: any): Promise<{
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
    create(createPagoDto: CreatePagoDto): Promise<CreatePagoDto & import("./pago.entity").Pago>;
    findAll(): Promise<import("./pago.entity").Pago[]>;
    findOne(id: string): Promise<import("./pago.entity").Pago | null>;
    update(id: string, updatePagoDto: UpdatePagoDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

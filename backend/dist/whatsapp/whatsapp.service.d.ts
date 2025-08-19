import { Repository } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';
export interface WhatsAppMessage {
    to: string;
    type: 'template' | 'text';
    template?: {
        name: string;
        language: {
            code: string;
        };
        components: any[];
    };
    text?: {
        body: string;
    };
}
export declare class WhatsappService {
    private reservaRepository;
    private readonly logger;
    private readonly apiUrl;
    private readonly accessToken;
    private readonly phoneNumberId;
    private readonly isConfigured;
    constructor(reservaRepository: Repository<Reserva>);
    enviarMensaje(mensaje: WhatsAppMessage): Promise<boolean>;
    enviarConfirmacionReserva(reserva: Reserva): Promise<boolean>;
    enviarRecordatorio48Horas(reserva: Reserva): Promise<boolean>;
    enviarRecordatoriosProgramados(): Promise<void>;
    private formatearTelefono;
    private formatearFecha;
    private obtenerTipoReservaTexto;
    verificarEstado(): Promise<{
        configurado: boolean;
        estado: string;
    }>;
}

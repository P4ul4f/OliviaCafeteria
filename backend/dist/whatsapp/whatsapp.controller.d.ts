import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    verificarEstado(): Promise<{
        configurado: boolean;
        estado: string;
    }>;
    webhook(body: any): Promise<{
        status: string;
    }>;
    testMensaje(body: {
        telefono: string;
        mensaje: string;
    }): Promise<{
        exito: boolean;
        mensaje: string;
    }>;
}

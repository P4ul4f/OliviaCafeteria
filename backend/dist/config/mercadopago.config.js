"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadopagoConfig = void 0;
exports.mercadopagoConfig = {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
    successUrl: process.env.MERCADOPAGO_SUCCESS_URL || 'https://olivia-cafeteria.vercel.app/pago/success',
    failureUrl: process.env.MERCADOPAGO_FAILURE_URL || 'https://olivia-cafeteria.vercel.app/pago/failure',
    pendingUrl: process.env.MERCADOPAGO_PENDING_URL || 'https://olivia-cafeteria.vercel.app/pago/pending',
    webhookUrl: process.env.MERCADOPAGO_WEBHOOK_URL || 'https://olivia-backend-production.up.railway.app/pago/webhook',
    isProduction: process.env.NODE_ENV === 'production',
    isConfigured() {
        return !!(this.accessToken && this.publicKey);
    },
    getSdkConfig() {
        if (!this.isConfigured()) {
            throw new Error('Mercado Pago no está configurado. Verifica las variables de entorno MERCADOPAGO_ACCESS_TOKEN y MERCADOPAGO_PUBLIC_KEY');
        }
        return {
            accessToken: this.accessToken,
            options: {
                timeout: 5000,
                idempotencyKey: 'olivia-' + Date.now(),
            }
        };
    }
};
//# sourceMappingURL=mercadopago.config.js.map
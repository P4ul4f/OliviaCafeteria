"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadopagoConfig = void 0;
exports.mercadopagoConfig = {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
    successUrl: process.env.MERCADOPAGO_SUCCESS_URL || 'http://localhost:3000/pago/success',
    failureUrl: process.env.MERCADOPAGO_FAILURE_URL || 'http://localhost:3000/pago/failure',
    pendingUrl: process.env.MERCADOPAGO_PENDING_URL || 'http://localhost:3000/pago/pending',
    webhookUrl: process.env.MERCADOPAGO_WEBHOOK_URL || 'http://localhost:3001/pago/webhook',
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
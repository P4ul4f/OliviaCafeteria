import { Preference, Payment } from 'mercadopago';

export const mercadopagoConfig = {
  // Credenciales de Mercado Pago
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
  
  // URLs de retorno - Usar URLs de producción por defecto
  successUrl: process.env.MERCADOPAGO_SUCCESS_URL || 'https://olivia-cafeteria.vercel.app/pago/success',
  failureUrl: process.env.MERCADOPAGO_FAILURE_URL || 'https://olivia-cafeteria.vercel.app/pago/failure',
  pendingUrl: process.env.MERCADOPAGO_PENDING_URL || 'https://olivia-cafeteria.vercel.app/pago/pending',
  
  // URL de webhook para notificaciones - Usar URL de producción por defecto
  webhookUrl: process.env.MERCADOPAGO_WEBHOOK_URL || 'https://olivia-backend-production.up.railway.app/pago/webhook',
  
  // Configuración de la aplicación
  isProduction: process.env.NODE_ENV === 'production',
  
  // Validar configuración
  isConfigured(): boolean {
    return !!(this.accessToken && this.publicKey);
  },
  
  // Obtener configuración para el SDK
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
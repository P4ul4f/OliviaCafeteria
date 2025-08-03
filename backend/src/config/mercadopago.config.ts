import { Preference, Payment } from 'mercadopago';

export const mercadopagoConfig = {
  // Credenciales de Mercado Pago
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
  
  // URLs de retorno
  successUrl: process.env.MERCADOPAGO_SUCCESS_URL || 'http://localhost:3000/pago/success',
  failureUrl: process.env.MERCADOPAGO_FAILURE_URL || 'http://localhost:3000/pago/failure',
  pendingUrl: process.env.MERCADOPAGO_PENDING_URL || 'http://localhost:3000/pago/pending',
  
  // URL de webhook para notificaciones
  webhookUrl: process.env.MERCADOPAGO_WEBHOOK_URL || 'http://localhost:3001/pago/webhook',
  
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
# Configuración de Mercado Pago

## Paso 1: Crear cuenta en Mercado Pago Developers

1. Ve a [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta de Mercado Pago
3. Ve a "Tus integraciones" o "Mis aplicaciones"
4. Crea una nueva aplicación

## Paso 2: Obtener las credenciales

### Para PRUEBAS (Sandbox):
- **Access Token**: Comienza con `TEST-`
- **Public Key**: Comienza con `TEST-`

### Para PRODUCCIÓN:
- **Access Token**: Comienza con `APP_USR-`
- **Public Key**: Comienza con `APP_USR-`

## Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=olivia_user
DB_PASSWORD=olivia_password
DB_DATABASE=olivia_db

# Mercado Pago Configuration
# Reemplaza con tus credenciales reales
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Backend Configuration
PORT=3001
NODE_ENV=development
```

## Paso 4: Configurar URLs de retorno

En el archivo `src/config/mercadopago.config.ts`, actualiza las URLs según tu entorno:

### Para desarrollo local:
```typescript
successUrl: 'http://localhost:3000/pago/success',
failureUrl: 'http://localhost:3000/pago/failure',
pendingUrl: 'http://localhost:3000/pago/pending',
notificationUrl: 'http://localhost:3001/pago/webhook',
```

### Para producción:
```typescript
successUrl: 'https://tudominio.com/pago/success',
failureUrl: 'https://tudominio.com/pago/failure',
pendingUrl: 'https://tudominio.com/pago/pending',
notificationUrl: 'https://tudominio.com/api/pago/webhook',
```

## Paso 5: Configurar webhook (para producción)

Para recibir notificaciones de pagos en producción:

1. Ve a tu panel de Mercado Pago Developers
2. Configura la URL del webhook: `https://tudominio.com/api/pago/webhook`
3. Selecciona los eventos que quieres recibir (payment, payment.updated, etc.)

## Paso 6: Probar la integración

### Tarjetas de prueba para sandbox:

**Tarjetas de crédito:**
- Visa: 4509 9535 6623 3704
- Mastercard: 5031 4332 1540 6351
- American Express: 3711 8030 3257 522

**CVV:** Cualquier número de 3 dígitos
**Fecha de vencimiento:** Cualquier fecha futura
**DNI:** Cualquier número de 7 u 8 dígitos

### Estados de pago:
- **approved**: Pago aprobado
- **pending**: Pago pendiente
- **in_process**: Pago en proceso
- **rejected**: Pago rechazado
- **cancelled**: Pago cancelado

## Paso 7: Monitoreo y logs

El sistema registra automáticamente:
- Creación de preferencias de pago
- Notificaciones recibidas
- Errores de procesamiento

Revisa los logs del backend para monitorear la actividad.

## Solución de problemas comunes

### Error: "Invalid access token"
- Verifica que el token sea correcto
- Asegúrate de usar credenciales de TEST para desarrollo

### Error: "Invalid preference"
- Verifica que todos los campos requeridos estén presentes
- Asegúrate de que el monto sea un número válido

### Webhook no funciona
- Verifica que la URL sea accesible desde internet
- Asegúrate de que el endpoint responda con HTTP 200

### Pago no se registra en la base de datos
- Verifica la conexión a la base de datos
- Revisa los logs del webhook
- Confirma que el external_reference sea correcto 
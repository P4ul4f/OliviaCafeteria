# Configuración de WhatsApp Business API

## Requisitos previos

1. **Cuenta de Meta for Business**: Necesitas una cuenta de Facebook Business
2. **Número de WhatsApp Business**: Un número de teléfono dedicado para tu negocio
3. **Aplicación de WhatsApp Business**: Configurada en Meta for Developers

## Paso 1: Configurar WhatsApp Business API

### 1.1. Crear aplicación en Meta for Developers
1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crea una nueva aplicación de tipo "Business"
3. Agrega el producto "WhatsApp Business API"

### 1.2. Configurar número de teléfono
1. En el dashboard de WhatsApp, agrega tu número de teléfono
2. Verifica el número siguiendo el proceso de verificación
3. Anota el **Phone Number ID** que aparece en el dashboard

### 1.3. Generar token de acceso
1. Ve a la sección "Tokens" en el dashboard de WhatsApp
2. Genera un **Access Token** permanente
3. Asegúrate de que tenga los permisos necesarios:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`

## Paso 2: Configurar variables de entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here

# Opcional: URL del webhook para mensajes entrantes
WHATSAPP_WEBHOOK_URL=https://tu-dominio.com/whatsapp/webhook
```

### Ejemplo de configuración:
```env
# WhatsApp Business API Configuration  
WHATSAPP_ACCESS_TOKEN=EAABsb...your_long_token_here...xyz
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_WEBHOOK_URL=https://oliviacafeteria-production.up.railway.app/whatsapp/webhook
```

## Paso 3: Configurar webhook (opcional)

Si quieres recibir mensajes entrantes de WhatsApp:

1. Configura la URL del webhook en el dashboard de Meta
2. URL: `https://tu-dominio.com/whatsapp/webhook`
3. Verifica el webhook con el token que proporciona Meta

## Paso 4: Números de teléfono en formato correcto

El sistema acepta varios formatos de número y los normaliza automáticamente:

✅ **Formatos aceptados:**
- `+5491123456789` (formato completo)
- `5491123456789` (sin +)
- `01123456789` (formato local argentino)
- `1123456789` (sin código de país)

✅ **Conversión automática:**
- `1123456789` → `+5491123456789`
- `01123456789` → `+5491123456789`
- `5491123456789` → `+5491123456789`

## Paso 5: Verificar configuración

1. Reinicia el servidor backend
2. Ve a `http://localhost:3001/whatsapp/estado` para verificar el estado
3. Deberías ver: `"configurado": true`

## Funcionalidades implementadas

### 🎉 Mensaje de confirmación automático
- Se envía inmediatamente después de completar el pago
- Incluye todos los detalles de la reserva
- Confirma la recepción del pago

### ⏰ Recordatorio automático 48 horas antes
- Tarea programada que se ejecuta cada 6 horas
- Busca reservas próximas (48 horas antes)
- Envía recordatorio con detalles de la reserva

### Plantilla del mensaje de confirmación:
```
🎉 ¡Reserva Confirmada - Olivia Café!

Hola [Nombre], tu reserva ha sido confirmada exitosamente.

📅 Detalles de tu reserva:
• Tipo: Merienda Libre
• Fecha: viernes, 22 de agosto de 2025, 16:30
• Turno: 16:30-18:30  
• Personas: 4
• Monto: $70.000

📍 Te esperamos en Olivia Café
📞 Cualquier consulta: +54 9 11 1234-5678

¡Gracias por elegirnos! ☕️❤️
```

### Plantilla del mensaje de recordatorio:
```
⏰ Recordatorio - Olivia Café

Hola [Nombre], te recordamos que tu reserva es en 48 horas.

📅 Detalles de tu reserva:
• Tipo: Merienda Libre
• Fecha: viernes, 22 de agosto de 2025, 16:30
• Turno: 16:30-18:30
• Personas: 4

📍 Olivia Café te espera
📞 Cualquier cambio: +54 9 11 1234-5678

¡Nos vemos pronto! ☕️🥐
```

## Costos y límites

### Costos (aproximados):
- **Mensajes de plantilla**: ~$0.05 USD por mensaje
- **Mensajes de texto libre**: ~$0.02 USD por mensaje
- **Primer mensaje del día**: A veces gratuito

### Límites de rate:
- **1000 mensajes/día** (nueva cuenta)
- **10000 mensajes/día** (cuenta verificada)
- **100000+ mensajes/día** (cuenta premium)

## Troubleshooting

### Error: "Invalid access token"
- Verifica que el token sea permanente, no temporal
- Asegúrate de que la aplicación tenga los permisos correctos

### Error: "Phone number not found"
- Verifica el Phone Number ID en el dashboard
- Asegúrate de que el número esté verificado

### Mensajes no se entregan
- Verifica que el número destino tenga WhatsApp
- Revisa el formato del número (+54 para Argentina)
- Consulta el dashboard de Meta para ver el estado de entrega

### Modo desarrollo/simulación
Si no configuras las variables de entorno, el sistema funcionará en **modo simulación**:
- Los mensajes se registran en los logs del servidor
- No se envían mensajes reales
- Útil para desarrollo y testing

## API endpoints disponibles

### GET `/whatsapp/estado`
Verificar configuración de WhatsApp

### POST `/whatsapp/test-mensaje`
Enviar mensaje de prueba:
```json
{
  "telefono": "+5491123456789",
  "mensaje": "Mensaje de prueba"
}
```

### POST `/whatsapp/webhook`
Webhook para mensajes entrantes (configurado automáticamente)

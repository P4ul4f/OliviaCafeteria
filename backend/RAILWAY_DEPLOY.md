# Deploy en Railway - Backend Olivia

## Configuración Requerida

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno en Railway:

#### Base de Datos
- `DB_HOST` - Host de la base de datos PostgreSQL
- `DB_PORT` - Puerto de la base de datos (default: 5432)
- `DB_USERNAME` - Usuario de la base de datos
- `DB_PASSWORD` - Contraseña de la base de datos
- `DB_DATABASE` - Nombre de la base de datos

#### JWT
- `JWT_SECRET` - Clave secreta para JWT (cambiar en producción)

#### MercadoPago (Opcional)
- `MERCADOPAGO_ACCESS_TOKEN` - Token de acceso de MercadoPago
- `MERCADOPAGO_PUBLIC_KEY` - Clave pública de MercadoPago

#### Email (Opcional)
- `EMAIL_HOST` - Servidor SMTP (default: smtp.gmail.com)
- `EMAIL_PORT` - Puerto SMTP (default: 587)
- `EMAIL_USER` - Email para envío
- `EMAIL_PASS` - Contraseña del email

#### Configuración del Servidor
- `PORT` - Puerto del servidor (Railway lo asigna automáticamente)
- `NODE_ENV` - Entorno (production)
- `FRONTEND_URL` - URL del frontend para CORS

## Proceso de Deploy

1. **Build**: Se ejecuta `npm run build` durante la instalación
2. **Verificación de BD**: Se verifica la conexión a la base de datos
3. **Migraciones**: Se ejecutan las migraciones automáticamente
4. **Start**: Se inicia la aplicación con `npm run start:prod`

## Healthcheck

El endpoint `/` responde con "Hello World!" y se usa como healthcheck.

## Logs

Los logs incluyen:
- Estado de la conexión a la base de datos
- Resultado de las migraciones
- Puerto en el que se ejecuta la aplicación
- Errores detallados si algo falla

## Troubleshooting

### Error de Conexión a BD
- Verificar que las variables de entorno de la BD estén configuradas
- Verificar que la base de datos esté activa en Railway

### Error de Migraciones
- Verificar que la BD tenga permisos para crear tablas
- Revisar los logs para errores específicos

### Error de Build
- Verificar que todas las dependencias estén en `package.json`
- Verificar que el código TypeScript compile correctamente 
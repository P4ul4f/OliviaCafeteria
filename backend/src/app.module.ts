import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReservaModule } from './reserva/reserva.module';
import { PagoModule } from './pago/pago.module';
import { AdministradorModule } from './administrador/administrador.module';
import { AuthModule } from './auth/auth.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { Reserva } from './reserva/reserva.entity';
import { Pago } from './pago/pago.entity';
import { Administrador } from './administrador/administrador.entity';
import { SiteConfig } from './site-config/site-config.entity';
import { PreciosConfig } from './precios-config/precios-config.entity';
import { FechasConfig } from './fechas-config/fechas-config.entity';
import { MenuPdf } from './menu-pdf/menu-pdf.entity';
import { MenuPdfModule } from './menu-pdf/menu-pdf.module';
import { FechasConfigModule } from './fechas-config/fechas-config.module';
import { PreciosConfigModule } from './precios-config/precios-config.module';
import { GiftCard } from './giftcard/giftcard.entity';
import { GiftCardModule } from './giftcard/giftcard.module';
import { ContenidoConfig } from './contenido-config/contenido-config.entity';
import { ContenidoConfigModule } from './contenido-config/contenido-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Validar que todas las variables de entorno necesarias estén presentes
        const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
        for (const envVar of requiredEnvVars) {
          if (!config.get(envVar)) {
            throw new Error(`Missing required environment variable: ${envVar}`);
          }
        }

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: parseInt(config.get('DB_PORT') ?? '5432', 10),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [
            Reserva, 
            Pago, 
            Administrador, 
            SiteConfig, 
            PreciosConfig, 
            FechasConfig, 
            MenuPdf,
            GiftCard,
            ContenidoConfig
          ],
          synchronize: false, // Usar migraciones en lugar de sincronización automática
          logging: config.get('NODE_ENV') === 'development',
          ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
    }),
    ReservaModule,
    PagoModule,
    AdministradorModule,
    AuthModule,
    SiteConfigModule,
    MenuPdfModule,
    FechasConfigModule,
    PreciosConfigModule,
    GiftCardModule,
    ContenidoConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
